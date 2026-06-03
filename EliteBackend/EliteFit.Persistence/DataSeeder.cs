using EliteFit.Domain.Authorization;
using EliteFit.Domain.Entities;
using EliteFit.Persistence.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace EliteFit.Persistence
{
    public static class DataSeeder
    {
        public static async Task SeedAsync(ApplicationDbContext db)
        {
            await SeedRolesAsync(db);
            await SeedPermissionsAsync(db);
            await SeedRolePermissionsAsync(db);
        }

        // ── Roles ─────────────────────────────────────────────────────────────
        private static async Task SeedRolesAsync(ApplicationDbContext db)
        {
            await db.Database.ExecuteSqlRawAsync(@"
                CREATE TABLE IF NOT EXISTS `roles` (
                    `id`          int NOT NULL AUTO_INCREMENT,
                    `name`        varchar(50) NOT NULL,
                    `description` longtext    NULL,
                    PRIMARY KEY (`id`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            ");

            var existing = (await db.Roles.Select(r => r.Name).ToListAsync()).ToHashSet();

            var defaults = new[]
            {
                ("Admin",        "Full system access"),
                ("Trainer",      "Training content management"),
                ("Nutritionist", "Nutrition content management"),
                ("Member",       "Standard member access"),
            };

            var toAdd = defaults
                .Where(x => !existing.Contains(x.Item1))
                .Select(x => new Role { Name = x.Item1, Description = x.Item2 })
                .ToList();

            if (toAdd.Count > 0)
            {
                db.Roles.AddRange(toAdd);
                await db.SaveChangesAsync();
            }
        }

        // ── Permissions ────────────────────────────────────────────────────────
        private static async Task SeedPermissionsAsync(ApplicationDbContext db)
        {
            await db.Database.ExecuteSqlRawAsync(@"
                CREATE TABLE IF NOT EXISTS `permissions` (
                    `id`          int NOT NULL AUTO_INCREMENT,
                    `name`        varchar(50) NOT NULL,
                    `description` longtext    NOT NULL,
                    PRIMARY KEY (`id`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            ");

            var existing = (await db.Permissions.Select(p => p.Name).ToListAsync()).ToHashSet();

            var defaults = new[]
            {
                (Permissions.Recipes.View,     "View recipes"),
                (Permissions.Recipes.Create,   "Create recipes"),
                (Permissions.Recipes.Update,   "Update recipes"),
                (Permissions.Recipes.Delete,   "Delete recipes"),
                (Permissions.Videos.View,      "View workout videos"),
                (Permissions.Videos.Create,    "Upload workout videos"),
                (Permissions.Videos.Update,    "Update workout videos"),
                (Permissions.Videos.Delete,    "Delete workout videos"),
                (Permissions.Badges.View,      "View badges"),
                (Permissions.Badges.Create,    "Create badges"),
                (Permissions.Badges.Update,    "Update badges"),
                (Permissions.Badges.Delete,    "Delete badges"),
                (Permissions.Users.View,       "View all users"),
                (Permissions.Users.Manage,     "Manage users"),
                (Permissions.Users.Activate,   "Activate user accounts"),
                (Permissions.Users.Deactivate, "Deactivate user accounts"),
                (Permissions.AuditLogs.View,   "View audit logs"),
                (Permissions.Roles.View,       "View roles and permissions"),
                (Permissions.Roles.Create,     "Create roles"),
                (Permissions.Roles.Update,     "Update role permissions"),
                (Permissions.Roles.Delete,     "Delete roles"),
            };

            var toAdd = defaults
                .Where(x => !existing.Contains(x.Item1))
                .Select(x => new Permission { Name = x.Item1, Description = x.Item2 })
                .ToList();

            if (toAdd.Count > 0)
            {
                db.Permissions.AddRange(toAdd);
                await db.SaveChangesAsync();
            }
        }

        // ── RolePermissions ────────────────────────────────────────────────────
        private static async Task SeedRolePermissionsAsync(ApplicationDbContext db)
        {
            await db.Database.ExecuteSqlRawAsync(@"
                CREATE TABLE IF NOT EXISTS `RolePermissions` (
                    `Id`           int NOT NULL AUTO_INCREMENT,
                    `RoleId`       int NOT NULL,
                    `PermissionId` int NOT NULL,
                    PRIMARY KEY (`Id`),
                    KEY `IX_RolePermissions_RoleId`       (`RoleId`),
                    KEY `IX_RolePermissions_PermissionId` (`PermissionId`),
                    CONSTRAINT `FK_RolePermissions_roles_RoleId`
                        FOREIGN KEY (`RoleId`)       REFERENCES `roles`       (`id`) ON DELETE CASCADE,
                    CONSTRAINT `FK_RolePermissions_permissions_PermissionId`
                        FOREIGN KEY (`PermissionId`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            ");

            // Resolve actual IDs from the database (do NOT assume hardcoded IDs)
            var permsByName = await db.Permissions.ToDictionaryAsync(p => p.Name, p => p.Id);
            var rolesByName = await db.Roles.ToDictionaryAsync(r => r.Name, r => r.Id);

            if (permsByName.Count == 0 || rolesByName.Count == 0) return;

            // Track what already exists to make this idempotent
            var existingPairs = (await db.RolePermissions
                .Select(rp => new { rp.RoleId, rp.PermissionId })
                .ToListAsync())
                .Select(x => (x.RoleId, x.PermissionId))
                .ToHashSet();

            var toAdd = new List<RolePermission>();

            void Assign(string roleName, string permName)
            {
                if (!rolesByName.TryGetValue(roleName, out var rid)) return;
                if (!permsByName.TryGetValue(permName, out var pid)) return;
                if (!existingPairs.Contains((rid, pid)))
                    toAdd.Add(new RolePermission { RoleId = rid, PermissionId = pid });
            }

            // Admin gets every permission
            foreach (var permName in Permissions.All())
                Assign("Admin", permName);

            // Trainer — video access
            Assign("Trainer", Permissions.Videos.View);
            Assign("Trainer", Permissions.Videos.Create);
            Assign("Trainer", Permissions.Videos.Update);

            // Nutritionist — recipe access
            Assign("Nutritionist", Permissions.Recipes.View);
            Assign("Nutritionist", Permissions.Recipes.Create);
            Assign("Nutritionist", Permissions.Recipes.Update);

            if (toAdd.Count > 0)
            {
                db.RolePermissions.AddRange(toAdd);
                await db.SaveChangesAsync();
            }
        }
    }
}
