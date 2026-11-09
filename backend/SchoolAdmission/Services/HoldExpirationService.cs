using Microsoft.EntityFrameworkCore;
using SchoolAdmission.Data;

namespace SchoolAdmission.Services;

public class HoldExpirationService: BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;

    public HoldExpirationService(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        using var timer = new PeriodicTimer(
            TimeSpan.FromSeconds(5)
        );

        while (await timer.WaitForNextTickAsync(stoppingToken))
        {
            using var scope = _scopeFactory.CreateScope();

            var context = scope.ServiceProvider
                .GetRequiredService<ApplicationDbContext>();

            var now = DateTime.UtcNow;

            var expiredHolds = await context.Holds
                .Where(h => 
                    h.Status == "HELD" &&
                    h.ExpiresAt <= now
                ).ToListAsync(stoppingToken);

            foreach (var hold in expiredHolds)
            {
                hold.Status = "EXPIRED";
            }

            if (expiredHolds.Count > 0)
            {
                await context.SaveChangesAsync(stoppingToken);
            }
        }
    }
}