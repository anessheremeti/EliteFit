using EliteFit.Domain.Authorization;
using EliteFit.Domain.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Concurrent;
using System.Security.Claims;

namespace EliteFit.Infrastructure.Authorization
{
    public sealed class PermissionAuthorizationHandler : AuthorizationHandler<PermissionRequirement>
    {
        private readonly IServiceProvider _sp;

        // 5-minute cache keyed by role name
        private static readonly ConcurrentDictionary<string, (HashSet<string> Perms, long Ticks)> _cache = new();
        private static readonly long _ttlTicks = TimeSpan.FromMinutes(5).Ticks;

        // Static fallback — used when DB tables are empty (first run before seeding)
        private static readonly Dictionary<string, HashSet<string>> _fallback = new()
        {
            ["Admin"]        = new HashSet<string>(Permissions.All()),
            ["Trainer"]      = new HashSet<string> { Permissions.Videos.View, Permissions.Videos.Create, Permissions.Videos.Update },
            ["Nutritionist"] = new HashSet<string> { Permissions.Recipes.View, Permissions.Recipes.Create, Permissions.Recipes.Update },
        };

        public PermissionAuthorizationHandler(IServiceProvider sp) => _sp = sp;

        protected override async Task HandleRequirementAsync(
            AuthorizationHandlerContext context, PermissionRequirement requirement)
        {
            var roles = context.User.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList();
            if (roles.Count == 0) return;

            foreach (var role in roles)
            {
                var perms = await ResolvePermissionsAsync(role);
                if (perms.Contains(requirement.Permission))
                {
                    context.Succeed(requirement);
                    return;
                }
            }
        }

        private async Task<HashSet<string>> ResolvePermissionsAsync(string roleName)
        {
            var now = DateTime.UtcNow.Ticks;
            if (_cache.TryGetValue(roleName, out var entry) && now - entry.Ticks < _ttlTicks)
                return entry.Perms;

            try
            {
                using var scope = _sp.CreateScope();
                var resolver = scope.ServiceProvider.GetRequiredService<IPermissionResolver>();
                var perms = await resolver.GetPermissionsForRoleAsync(roleName);

                if (perms.Count > 0)
                {
                    _cache[roleName] = (perms, now);
                    return perms;
                }
            }
            catch
            {
                // Fall through to static fallback
            }

            // Fallback until DB is seeded
            return _fallback.TryGetValue(roleName, out var fallback) ? fallback : [];
        }

        /// <summary>Call this after role-permission changes to force a cache refresh.</summary>
        public static void InvalidateCache() => _cache.Clear();
    }
}
