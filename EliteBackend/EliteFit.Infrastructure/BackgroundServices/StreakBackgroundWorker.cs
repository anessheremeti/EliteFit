using EliteFit.Domain.Interfaces.Repositories.Gamification;
using EliteFit.Domain.Interfaces.Repositories.Recipes.Command;
using EliteFit.Domain.Interfaces.Services; // Sigurohu që kjo ndodhet këtu për IRealTimeNotificationService
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading;
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
                        var notificationService = scope.ServiceProvider.GetRequiredService<IRealTimeNotificationService>();

                        var allStreaks = await repository.GetAllStreaksAsync(stoppingToken);
                        var yesterday = DateTime.UtcNow.Date.AddDays(-1);

                        foreach (var streak in allStreaks)
                        {
                            if (streak.LastActivityDate.HasValue && streak.LastActivityDate.Value.Date < yesterday)
                            {
                                string titulli = "";
                                string mesazhi = "";

                                if (streak.StreakFreezeCount.HasValue && streak.StreakFreezeCount.Value > 0)
                                {
                                    streak.StreakFreezeCount -= 1;
                                    streak.LastActivityDate = DateTime.UtcNow.Date.AddDays(-1);

                                    titulli = "Streak Freeze u përdor! 🧊";
                                    mesazhi = "Sapo u shpëtua seria juaj e ditëve aktive! Kryeni një aktivitet sot që mos ta humbni atë.";

                                    _logger.LogInformation($"User {streak.UserId} përdori Streak Freeze.");
                                }
                                else
                                {
                                    streak.CurrentStreak = 0;

                                    titulli = "Seria u ndërpre 😢";
                                    mesazhi = "Ju nuk keni qenë aktiv ditët e fundit, streak-u juaj u rikthye në 0. Filloni sot një stërvitje të re!";

                                    _logger.LogInformation($"User {streak.UserId} i u bë reset Streak në 0.");
                                }

                                streak.UpdatedAt = DateTime.UtcNow;
                                await repository.UpdateAsync(streak, stoppingToken);

                                // Dërgimi i njoftimit live
                                await notificationService.SendNotificationToUserAsync(streak.UserId, titulli, mesazhi, "streak_alert");
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Gabim gjatë ekzekutimit të Streak Background Worker.");
                }

                await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
            }
        }
    }
}