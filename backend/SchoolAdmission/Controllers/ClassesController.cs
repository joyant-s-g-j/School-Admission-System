using Microsoft.AspNetCore.Mvc;
using SchoolAdmission.Data;

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
}