using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolAdmission.Data;

namespace SchoolAdmission.Controllers;

[ApiController]
[Route("holds")]
public class HoldsController: ControllerBase
{
    private readonly ApplicationDbContext _context;

    public HoldsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("{holdId:guid}")]
    public async Task<IActionResult> GetHold(Guid holdId)
    {
        var studentId = Request.Headers["X-Student-Id"].ToString();

        if (studentId.Length != 17 ||
            !studentId.All(char.IsDigit))
        {
            return BadRequest(new
            {
                message = "A valid 17-digit birth registration number is required."
            });
        }

        var hold = await _context.Holds
            .Where(h => h.Id == holdId && h.StudentId == studentId)
            .Select(h => new
            {
                h.Id,
                h.ClassId,
                h.StudentId,
                h.CreatedAt,
                h.ExpiresAt,
                h.Status
            }).FirstOrDefaultAsync();

        if (hold == null)
        {
            return NotFound(new
            {
                message = "Hold not found."
            });
        }

        return Ok(hold);
    }

    [HttpPost("{holdId:guid}/confirm")]
    public async Task<IActionResult> ConfirmHold(Guid holdId)
    {
        var studentId = Request.Headers["X-Student-Id"].ToString();

        if (studentId.Length != 17 ||
            !studentId.All(char.IsDigit)
        )
        {
            return BadRequest(new
            {
                message = "A valid 17-digit birth registration number is required."
            });
        }

        var existingHold = await _context.Holds
            .AsNoTracking()
            .FirstOrDefaultAsync(h => 
                h.Id == holdId &&
                h.StudentId == studentId
            );

        if (existingHold == null)
        {
            return NotFound(new
            {
                message = "Hold not found"
            });
        }

        await using var transaction = await _context.Database.BeginTransactionAsync();

        var schoolClass = await _context.Classes
            .FromSqlInterpolated(
                $"SELECT * FROM \"Classes\" WHERE \"Id\" = {existingHold.ClassId} FOR UPDATE"
            ).FirstOrDefaultAsync();

        if (schoolClass == null)
        {
            return NotFound(new
            {
                message = "Class not found."
            });
        }

        var hold = await _context.Holds
            .FirstAsync(h => h.Id == holdId);

        if (hold.Status == "CONFIRMED")
        {
            await transaction.CommitAsync();

            return Ok(new
            {
                hold.Id,
                hold.ClassId,
                hold.StudentId,
                hold.Status,
                hold.ConfirmedAt
            });
        }

        var now = DateTime.UtcNow;

        if (hold.Status == "HELD" && hold.ExpiresAt <= now)
        {
            hold.Status = "EXPIRED";

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return Conflict(new
            {
                message = "This hold has expired. Please apply again."
            });
        }

        if (hold.Status != "HELD")
        {
            return Conflict(new
            {
                message = "This hold cannot be confirmed."
            });
        }

        hold.Status = "CONFIRMED";
        hold.ConfirmedAt = now;

        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        return Ok(new
        {
            hold.Id,
            hold.ClassId,
            hold.StudentId,
            hold.Status,
            hold.ConfirmedAt
        });
    }

    [HttpDelete("{holdId:guid}")]
    public async Task<IActionResult> CancelHold(Guid holdId)
    {
        var studentId = Request.Headers["X-Student-Id"].ToString();

        if (studentId.Length != 17 ||
            !studentId.All(char.IsDigit)
        )
        {
            return BadRequest(new
            {
                message = "A valid 17-digit birth registration number is required."
            });
        }

        var existingHold = await _context.Holds
            .AsNoTracking()
            .FirstOrDefaultAsync(h =>
                h.Id == holdId &&
                h.StudentId == studentId
            );

        if (existingHold == null)
        {
            return NotFound(new
            {
                message = "Hold not found."
            });
        }

        await using var transaction =
            await _context.Database.BeginTransactionAsync();

        var schoolClass = await _context.Classes
            .FromSqlInterpolated(
                $"SELECT * FROM \"Classes\" WHERE \"Id\" = {existingHold.ClassId} FOR UPDATE"
            ).FirstOrDefaultAsync();

        if (schoolClass == null)
        {
            return NotFound(new
            {
                message = "Class not found."
            });
        }

        var hold = await _context.Holds
            .FirstAsync(h => h.Id == holdId);

        if (hold.Status != "HELD")
        {
            return Conflict(new
            {
                message = "Only active holds can be cancelled."
            });
        }

        if (hold.ExpiresAt <= DateTime.UtcNow)
        {
            hold.Status = "EXPIRED";

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return Conflict(new
            {
                message = "This hold has already expired."
            });
        }

        hold.Status = "CANCELLED";

        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        return Ok(new
        {
            hold.Id,
            hold.ClassId,
            hold.StudentId,
            hold.Status
        });
    }
}