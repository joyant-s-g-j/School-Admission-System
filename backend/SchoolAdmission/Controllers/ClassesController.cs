using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolAdmission.Data;
using SchoolAdmission.DTOs;
using SchoolAdmission.Models;

namespace SchoolAdmission.Controllers;

[ApiController]
[Route("classes")]
public class ClassesController: ControllerBase
{
    private readonly ApplicationDbContext _context;

    private readonly IConfiguration _configuration;

    public ClassesController(ApplicationDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    // POST / classes
    [HttpPost]
    public async Task<IActionResult> CreateClass(CreateClassRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest(new { message = "Class name is required." });
        }

        if (request.TotalSeats <= 0)
        {
            return BadRequest(new { message = "Total seats must be greater than zero" });
        }

        var schoolClass = new SchoolClass
        {
            Name = request.Name.Trim(),
            TotalSeats = request.TotalSeats
        };

        _context.Classes.Add(schoolClass);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(CreateClass),
            new { id = schoolClass.Id },
            schoolClass
        );
    }

    // GET / classes
    [HttpGet]
    public async Task<IActionResult> GetClasses()
    {
        var now = DateTime.UtcNow;

        var classes = await _context.Classes
            .Select(schoolClass => new
            {
              schoolClass.Id,
              schoolClass.Name,
              schoolClass.TotalSeats,

              HeldSeats = _context.Holds.Count(hold => 
                hold.ClassId == schoolClass.Id &&
                hold.Status == "HELD" &&
                hold.ExpiresAt > now
              ),

              confirmedSeats = _context.Holds.Count(hold =>
                hold.ClassId == schoolClass.Id &&
                hold.Status == "CONFIRMED"
              )
            }).ToListAsync();

        var result = classes.Select(schoolClass => new
        {
            schoolClass.Id,
            schoolClass.Name,
            schoolClass.TotalSeats,
            schoolClass.HeldSeats,
            schoolClass.confirmedSeats,

            AvailableSeats = schoolClass.TotalSeats - schoolClass.HeldSeats - schoolClass.confirmedSeats
        });

        return Ok(result);
    }

    // POST classes/{classId}
    [HttpGet("{classId:guid}")]
    public async Task<IActionResult> GetClass(Guid classId)
    {
        var now = DateTime.UtcNow;

        var schoolClass = await _context.Classes
            .Where(c => c.Id == classId)
            .Select(c => new
            {
                c.Id,
                c.Name,
                c.TotalSeats,

                HeldSeats = _context.Holds.Count(h => 
                    h.ClassId == c.Id &&
                    h.Status == "HELD" &&
                    h.ExpiresAt > now
                ),

                ConfirmedSeats = _context.Holds.Count(h =>
                    h.ClassId == c.Id &&
                    h.Status == "CONFIRMED"
                )
            }).FirstOrDefaultAsync();

        if (schoolClass == null)
        {
            return NotFound(new { message = "Class not found." });
        }

        return Ok(new
        {
            schoolClass.Id,
            schoolClass.Name,
            schoolClass.TotalSeats,
            schoolClass.HeldSeats,
            schoolClass.ConfirmedSeats,
            AvailableSeats = schoolClass.TotalSeats - schoolClass.HeldSeats - schoolClass.ConfirmedSeats
        });
    }

    // Post classes/classId/holds
    [HttpPost("{classId:guid}/holds")]
    public async Task<IActionResult> CreateHold(Guid classId)
    {
        // read student id
        var studentId = Request.Headers["X-Student-Id"].ToString();

        if (studentId.Length != 17 || !studentId.All(char.IsDigit))
        {
            return BadRequest(new 
            {  
                message = "A valid 17-digit birth registration number is required,"
            });
        }

        // read hold duration
        var holdDuration = _configuration
            .GetValue<int?>("HOLD_DURATION_SECONDS") ?? 600;

        if (holdDuration <= 0)
        {
            return StatusCode(500, new
            {
                message = "Invalid hold duration configuration"
            });
        }

        await using var transaction = await _context.Database.BeginTransactionAsync();

        var now = DateTime.UtcNow;

        var schoolClass = await _context.Classes
            .FromSqlInterpolated(
                $"SELECT * FROM \"Classes\" WHERE \"Id\" = {classId} FOR UPDATE" 
            ).FirstOrDefaultAsync();

        if (schoolClass == null)
        {
            return NotFound(new { message = "Class not found."});
        }

        var expiredHolds = await _context.Holds
            .Where(h => 
                h.ClassId == classId &&
                h.Status == "HELD" &&
                h.ExpiresAt <= now
            ).ToListAsync();

        foreach (var hold in expiredHolds)
        {
            hold.Status = "EXPIRED";
        }

        var existingAdmission = await _context.Holds
            .AnyAsync(h => 
                h.ClassId == classId &&
                h.StudentId == studentId &&
                (
                    h.Status == "CONFIRMED" || 
                    (h.Status == "HELD" && h.ExpiresAt > now)
                )
            );

        if (existingAdmission)
        {
            return Conflict(new
            {
                message = "You already have an active hold or confirmed admission for this class."
            });
        }

        var occupiedSeats = await _context.Holds
            .CountAsync(h =>
                h.ClassId == classId &&
                (
                    h.Status == "CONFIRMED" ||
                    (h.Status == "HELD" && h.ExpiresAt > now)
                )
            );

        if (occupiedSeats >= schoolClass.TotalSeats)
        {
            return Conflict(new
            {
                message = "No seats are currenty available."
            });
        }

        var newHold = new AdmissionHold
        {
            ClassId = classId,
            StudentId = studentId,
            CreatedAt = now,
            ExpiresAt = now.AddSeconds(holdDuration),
            Status = "HELD"
        };

        _context.Holds.Add(newHold);

        await _context.SaveChangesAsync();

        await transaction.CommitAsync();

        return StatusCode(201, new
        {
            newHold.Id,
            newHold.ClassId,
            newHold.StudentId,
            newHold.CreatedAt,
            newHold.ExpiresAt,
            newHold.Status
        });
    }
}