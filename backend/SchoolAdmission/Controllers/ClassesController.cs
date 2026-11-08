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

    public ClassesController(ApplicationDbContext context)
    {
        _context = context;
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
}