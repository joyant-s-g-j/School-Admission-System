using Microsoft.EntityFrameworkCore;
using SchoolAdmission.Data;
using SchoolAdmission.Services;

var builder = WebApplication.CreateBuilder(args);

//Register services
builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddDbContext<ApplicationDbContext>(options => 
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

builder.Services.AddOpenApi();
builder.Services.AddHostedService<HoldExpirationService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

if (!app.Environment.IsEnvironment("Testing"))
{
    app.UseHttpsRedirection();
}

app.UseCors("FrontendPolicy");

app.MapControllers();

app.Run();

public partial class Program { }