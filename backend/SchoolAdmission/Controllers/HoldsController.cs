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
}