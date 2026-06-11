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
            // HEQUR: MarkBaselineMigrationAsync nuk duhet për MSSQL pasi migrimet menaxhohen nga fillimi
            await EnsureRefreshTokensTableAsync(db);
            await SeedRolesAsync(db);
            await SeedPermissionsAsync(db);
            await SeedRolePermissionsAsync(db);
            await SeedDefaultUsersAsync(db);
            await BackfillMissingMemberRolesAsync(db);
        }

        private static async Task EnsureRefreshTokensTableAsync(ApplicationDbContext db)
        {
            try
            {
                // Përshtatur plotësisht për sintaksën e MSSQL Server (T-SQL)
                await db.Database.ExecuteSqlRawAsync(@"
                    IF OBJECT_ID(N'[dbo].[refresh_tokens]', N'U') IS NULL
                    BEGIN
                        CREATE TABLE [dbo].[refresh_tokens] (
                            [id]          int IDENTITY(1,1) NOT NULL,
                            [user_id]     int           NOT NULL,
                            [token_hash]  nvarchar(512) NOT NULL,
                            [expires_at]  datetime2(6)  NOT NULL,
                            [revoked_at]  datetime2(6)  NULL,
                            [created_at]  datetime2(6)  NULL DEFAULT GETDATE(),
                            CONSTRAINT [PK_refresh_tokens] PRIMARY KEY ([id]),
                            CONSTRAINT [FK_refresh_tokens_users_user_id] 
                                FOREIGN KEY ([user_id]) REFERENCES [users] ([id]) ON DELETE CASCADE
                        );

                        CREATE UNIQUE INDEX [IX_refresh_tokens_token_hash] 
                            ON [dbo].[refresh_tokens] ([token_hash]);

                        CREATE INDEX [IX_refresh_tokens_user_id] 
                            ON [dbo].[refresh_tokens] ([user_id]);
                    END;
                ");
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"[Seed] EnsureRefreshTokensTable failed: {ex.Message}");
            }
        }

        // ── Backfill ───────────────────────────────────────────────────────────
        private static async Task BackfillMissingMemberRolesAsync(ApplicationDbContext db)
        {
            var memberRole = await db.Roles.FirstOrDefaultAsync(r => r.Name == "Member");
            if (memberRole is null) return;

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
                    UserId = user.Id,
                    RoleId = memberRole.Id,
                    AssignedAt = DateTime.UtcNow,
                });
                Console.WriteLine($"[Seed] Backfilled Member role → {user.Email}");
            }

            await db.SaveChangesAsync();
        }

        // ── Default test users ─────────────────────────────────────────────────
        private static async Task SeedDefaultUsersAsync(ApplicationDbContext db)
        {
            await SeedUserIfMissing(db, "admin@elitefit.com", "Admin", "User", "Admin123!", "Admin");
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
                FirstName = firstName,
                LastName = lastName,
                Email = email,
                PasswordHash = passwordHash,
                IsActive = true,
            };
            db.Users.Add(user);
            await db.SaveChangesAsync();

            db.UserRoles.Add(new UserRole
            {
                UserId = user.Id,
                RoleId = role.Id,
                AssignedAt = DateTime.UtcNow,
            });
            await db.SaveChangesAsync();

            Console.WriteLine($"[Seed] Created {roleName} — email: {email}  password: {plainPassword}");
        }

        // ── Roles ─────────────────────────────────────────────────────────────
        private static async Task SeedRolesAsync(ApplicationDbContext db)
        {
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
            var permsByName = await db.Permissions.ToDictionaryAsync(p => p.Name, p => p.Id);
            var rolesByName = await db.Roles.ToDictionaryAsync(r => r.Name, r => r.Id);

            if (permsByName.Count == 0 || rolesByName.Count == 0) return;

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

            foreach (var permName in Permissions.All())
                Assign("Admin", permName);

            Assign("Trainer", Permissions.Videos.View);
            Assign("Trainer", Permissions.Videos.Create);
            Assign("Trainer", Permissions.Videos.Update);

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