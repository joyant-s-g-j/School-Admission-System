using Microsoft.EntityFrameworkCore;
using SchoolAdmission.Models;

namespace SchoolAdmission.Data;

public class ApplicationDbContext: DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) {}
    public DbSet<SchoolClass> Classes { get; set; }
    public DbSet<AdmissionHold> Holds { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<SchoolClass>(entity =>
        {
            entity.Property(c => c.Name)
                .IsRequired()
                .HasMaxLength(100);

            entity.ToTable(t =>
                t.HasCheckConstraint(
                    "CK_Classes_TotalSeats",
                    "\"TotalSeats\" > 0"
                )
            );
        });

        modelBuilder.Entity<AdmissionHold>(entity =>
        {
            entity.Property(h => h.StudentId)
                .IsRequired()
                .HasMaxLength(17);

            entity.Property(h => h.Status)
                .IsRequired()
                .HasMaxLength(20);
            
            entity.HasOne(h => h.SchoolClass)
                .WithMany()
                .HasForeignKey(h => h.ClassId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(h => new
            {
                h.ClassId,
                h.StudentId
            }).HasDatabaseName("IX_Holds_ClassId_StudentId");

            entity.HasIndex(h => h.StudentId).HasDatabaseName("IX_Holds_StudentId");

            entity.ToTable(t =>
            {
                t.HasCheckConstraint(
                    "CK_Holds_Status",
                    "\"Status\" IN ('HELD', 'CONFIRMED', 'EXPIRED', 'CANCELLED')"
                );

                t.HasCheckConstraint(
                    "CK_HOlds_StudentId",
                    "\"StudentId\" ~ '^[0-9]{17}$'"
                );
            });

            entity.HasIndex(h => new
            {
                h.ClassId,
                h.StudentId
            })
            .IsUnique()
            .HasFilter("\"Status\" IN ('HELD', 'CONFIRMED')")
            .HasDatabaseName("UX_Holds_ActiveAdmission");
        });
    }
}