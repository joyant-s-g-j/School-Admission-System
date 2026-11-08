namespace SchoolAdmission.Models;

public class SchoolClass
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int TotalSeats { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}