using EliteFit.Domain.Interfaces.Repositories.Gamification;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Infrastructure.BackgroundServices
{
    public class StreakBackgroundWorker : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<StreakBackgroundWorker> _logger;

        public StreakBackgroundWorker(IServiceProvider serviceProvider, ILogger<StreakBackgroundWorker> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Shërbimi i kontrollit të Streak u nis automatikisht.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using (var scope = _serviceProvider.CreateScope())
                    {
                        var repository = scope.ServiceProvider.GetRequiredService<IUserStreakRepository>();
                        var allStreaks = await repository.GetAllStreaksAsync(stoppingToken);
                        var yesterday = DateTime.UtcNow.Date.AddDays(-1);

                        foreach (var streak in allStreaks)
                        {
                            if (streak.LastActivityDate.HasValue && streak.LastActivityDate.Value.Date < yesterday)
                            {
                                // Përdoruesi ka harruar më shumë se një ditë pa kryer aktivitet!
                                if (streak.StreakFreezeCount.HasValue && streak.StreakFreezeCount.Value > 0)
                                {
                                    // Përdor Streak Freeze nëse ka në dispozicion
                                    streak.StreakFreezeCount -= 1;
                                    streak.LastActivityDate = DateTime.UtcNow.Date.AddDays(-1); // i jepet edhe një ditë kohë
                                    _logger.LogInformation($"User {streak.UserId} përdori Streak Freeze.");
                                }
                                else
                                {
                                    // Resetohet në 0 sepse nuk ka as freeze count
                                    streak.CurrentStreak = 0;
                                    _logger.LogInformation($"User {streak.UserId} i u bë reset Streak në 0.");
                                }

                                streak.UpdatedAt = DateTime.UtcNow;
                                await repository.UpdateAsync(streak, stoppingToken);
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Gabim gjatë ekzekutimit të Streak Background Worker.");
                }

                // Ekzekutohet çdo 24 orë (ose mund ta ndryshosh sipas dëshirës)
                await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
            }
        }
    }
}
