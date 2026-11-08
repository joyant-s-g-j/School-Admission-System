namespace SchoolAdmission.DTOs;

public class CreateClassRequest
{
    public string Name { get; set; } = string.Empty;

    public int TotalSeats{ get; set; }
}