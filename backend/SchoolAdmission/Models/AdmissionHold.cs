namespace SchoolAdmission.Models;

public class AdmissionHold
{
    public Guid Id { get; set; }
    public Guid ClassId { get; set; }
    public string StudentId { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime ExpiresAt { get; set; }
    public DateTime? ConfirmedAt { get; set; }
    public string Status { get; set; } = "HELD";
    public SchoolClass? SchoolClass { get; set; }
}