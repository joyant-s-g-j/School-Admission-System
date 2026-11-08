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
        var classes = await _context.Classes
            .Select(schoolClass => new
            {
              schoolClass.Id,
              schoolClass.Name,
              schoolClass.TotalSeats  
            }).ToListAsync();

        return Ok(classes);
    }
}