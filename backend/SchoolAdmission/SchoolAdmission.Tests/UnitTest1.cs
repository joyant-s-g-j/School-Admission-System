using System.Net;
using System.Net.Http.Json;

namespace SchoolAdmission.Tests;

public class UnitTest1 : IClassFixture<TestWebApplicationFactory>
{
    private readonly HttpClient _client;

    public UnitTest1(TestWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task CreateClass_WithValidData_ReturnsCreated()
    {
        // Arrange
        var request = new
        {
            Name = "Test Class",
            TotalSeats = 30
        };

        // Act
        var response = await _client.PostAsJsonAsync(
            "/classes",
            request
        );

        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }

    [Fact]
    public async Task CreateClass_WithInvalidSeatCount_ReturnsBadRequest()
    {
        // Arrange
        var request = new
        {
            Name = "Invalid Class",
            TotalSeats = 0
        };

        // Act
        var response = await _client.PostAsJsonAsync(
            "/classes",
            request
        );

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateHold_WithValidStudentId_ReturnsCreated()
    {
        // Arrange: Create a class
        var classRequest = new
        {
            Name = "Hold Test Class",
            TotalSeats = 10
        };

        var classResponse = await _client.PostAsJsonAsync(
            "/classes",
            classRequest
        );

        var createdClass = await classResponse.Content
            .ReadFromJsonAsync<System.Text.Json.JsonElement>();

        var classId = createdClass.GetProperty("id").GetString();

        // Arrange: Prepare hold request
        var request = new HttpRequestMessage(
            HttpMethod.Post,
            $"/classes/{classId}/holds"
        );

        request.Headers.Add(
            "X-Student-Id",
            "20001234567890123"
        );

        // Act
        var response = await _client.SendAsync(request);

        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }

    [Fact]
    public async Task CreateHold_ConcurrentRequestsWithOneSeat_AllowsOnlyOneStudent()
    {
        // Arrange: Create a class with only one seat
        var classRequest = new
        {
            Name = "Concurrency Test Class",
            TotalSeats = 1
        };

        var classResponse = await _client.PostAsJsonAsync(
            "/classes",
            classRequest
        );

        classResponse.EnsureSuccessStatusCode();

        var createdClass = await classResponse.Content
            .ReadFromJsonAsync<System.Text.Json.JsonElement>();

        var classId = createdClass.GetProperty("id").GetString();

        // Act: Send 5 requests simultaneously
        var tasks = Enumerable.Range(0, 5).Select(async i =>
        {
            using var request = new HttpRequestMessage(
                HttpMethod.Post,
                $"/classes/{classId}/holds"
            );

            request.Headers.Add(
                "X-Student-Id",
                $"20001234567890{i:D3}"
            );

            using var response = await _client.SendAsync(request);

            return response.StatusCode;
        });

        var results = await Task.WhenAll(tasks);

        // Assert
        Assert.Equal(
            1,
            results.Count(status => status == HttpStatusCode.Created)
        );

        Assert.Equal(
            4,
            results.Count(status => status == HttpStatusCode.Conflict)
        );
    }
}