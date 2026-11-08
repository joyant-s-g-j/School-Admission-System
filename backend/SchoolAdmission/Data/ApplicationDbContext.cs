using Microsoft.EntityFrameworkCore;
using SchoolAdmission.Models;

namespace SchoolAdmission.Data;

public class ApplicationDbContext: DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) {}
    public DbSet<SchoolClass> Classes { get; set; }
    public DbSet<AdmissionHold> Holds { get; set; }
}