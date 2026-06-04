using EliteFit.Domain.Authorization;
using EliteFit.Domain.Entities;
using EliteFit.Persistence.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace EliteFit.Persistence
{
    public static class DataSeeder
    {
        public static async Task SeedAsync(ApplicationDbContext db)
        {
            await EnsureSettingsTableAsync(db);
            await EnsureNotificationsColumnsAsync(db);
            await SeedRolesAsync(db);
            await SeedPermissionsAsync(db);
            await SeedRolePermissionsAsync(db);
            await SeedDefaultUsersAsync(db);
            await BackfillMissingMemberRolesAsync(db);
        }

        // ── Backfill ───────────────────────────────────────────────────────────
        // Users registered before the RegisterCommand role-persistence fix have
        // no user_roles row. Assign them "Member" so they can log in.
        private static async Task BackfillMissingMemberRolesAsync(ApplicationDbContext db)
        {
            var memberRole = await db.Roles.FirstOrDefaultAsync(r => r.Name == "Member");
            if (memberRole is null) return;

            // Find user IDs that have zero role assignments
            var assignedUserIds = await db.UserRoles
                .Select(ur => ur.UserId)
                .Distinct()
                .ToListAsync();

            var unassigned = await db.Users
                .Where(u => !assignedUserIds.Contains(u.Id))
                .ToListAsync();

            if (unassigned.Count == 0) return;

            foreach (var user in unassigned)
            {
                db.UserRoles.Add(new UserRole
                {
                    UserId     = user.Id,
                    RoleId     = memberRole.Id,
                    AssignedAt = DateTime.UtcNow,
                });
                Console.WriteLine($"[Seed] Backfilled Member role → {user.Email}");
            }

            await db.SaveChangesAsync();
        }

        // ── Default test users ─────────────────────────────────────────────────
        // Creates one Admin and one Member account on first startup.
        // Credentials are printed to the console so you can log in immediately.
        private static async Task SeedDefaultUsersAsync(ApplicationDbContext db)
        {
            await SeedUserIfMissing(db, "admin@elitefit.com",  "Admin",  "User", "Admin123!",  "Admin");
            await SeedUserIfMissing(db, "member@elitefit.com", "Member", "User", "Member123!", "Member");
        }

        private static async Task SeedUserIfMissing(
            ApplicationDbContext db,
            string email, string firstName, string lastName,
            string plainPassword, string roleName)
        {
            if (await db.Users.AnyAsync(u => u.Email == email))
                return;

            var role = await db.Roles.FirstOrDefaultAsync(r => r.Name == roleName);
            if (role is null) return;

            var salt = RandomNumberGenerator.GetBytes(16);
            var hash = Rfc2898DeriveBytes.Pbkdf2(
                plainPassword, salt, 10_000, HashAlgorithmName.SHA256, 32);
            var passwordHash = $"{Convert.ToBase64String(salt)}:{Convert.ToBase64String(hash)}";

            var user = new User
            {
                FirstName    = firstName,
                LastName     = lastName,
                Email        = email,
                PasswordHash = passwordHash,
                IsActive     = true,
            };
            db.Users.Add(user);
            await db.SaveChangesAsync();

            db.UserRoles.Add(new UserRole
            {
                UserId     = user.Id,
                RoleId     = role.Id,
                AssignedAt = DateTime.UtcNow,
            });
            await db.SaveChangesAsync();

            Console.WriteLine($"[Seed] Created {roleName} — email: {email}  password: {plainPassword}");
        }

        private static async Task EnsureNotificationsColumnsAsync(ApplicationDbContext db)
        {
            // Create table for fresh installs (migration may not have run)
            await db.Database.ExecuteSqlRawAsync(@"
                CREATE TABLE IF NOT EXISTS `Notifications` (
                    `Id`        int          NOT NULL AUTO_INCREMENT,
                    `UserId`    int          NOT NULL,
                    `Type`      varchar(100) NULL,
                    `Title`     varchar(500) NULL,
                    `Message`   longtext     NULL,
                    `IsRead`    tinyint(1)   NOT NULL DEFAULT 0,
                    `CreatedAt` datetime(6)  NULL DEFAULT CURRENT_TIMESTAMP(6),
                    PRIMARY KEY (`Id`),
                    CONSTRAINT `FK_Notifications_users_UserId`
                        FOREIGN KEY (`UserId`) REFERENCES `users` (`id`) ON DELETE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            ");

            // Add column to existing installs that were created before CreatedAt was added.
            // ALTER TABLE ... ADD COLUMN IF NOT EXISTS requires MySQL 8.0.3+; the declared
            // server version is 8.0.0, so we drop IF NOT EXISTS and swallow the duplicate-
            // column error (1060) that MySQL raises when the column is already present.
            try
            {
                await db.Database.ExecuteSqlRawAsync(@"
                    ALTER TABLE `Notifications`
                    ADD COLUMN `CreatedAt` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6);
                ");
            }
            catch (Exception ex) when (ex.Message.Contains("Duplicate column"))
            {
                // Column already exists — nothing to do
            }
        }

        private static async Task EnsureSettingsTableAsync(ApplicationDbContext db)
        {
            // `Key` is a MySQL reserved word — must be backtick-quoted in DDL
            await db.Database.ExecuteSqlRawAsync(@"
                CREATE TABLE IF NOT EXISTS `Settings` (
                    `Id`          int          NOT NULL AUTO_INCREMENT,
                    `Key`         varchar(500) NOT NULL,
                    `Value`       longtext     NULL,
                    `Description` longtext     NULL,
                    PRIMARY KEY (`Id`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            ");
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
                (Permissions.Roles.View,        "View roles and permissions"),
                (Permissions.Roles.Create,      "Create roles"),
                (Permissions.Roles.Update,      "Update role permissions"),
                (Permissions.Roles.Delete,      "Delete roles"),
                (Permissions.Settings.View,     "View system settings"),
                (Permissions.Settings.Create,   "Create system settings"),
                (Permissions.Settings.Update,   "Update system settings"),
                (Permissions.Settings.Delete,   "Delete system settings"),
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
