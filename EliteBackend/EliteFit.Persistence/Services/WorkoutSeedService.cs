using EliteFit.Domain.Entities;
using EliteFit.Persistence.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace EliteFit.Persistence.Services
{
    public class WorkoutSeedService
    {
        private readonly ApplicationDbContext _db;
        private readonly string _uploadsRoot;
        private readonly ILogger<WorkoutSeedService> _logger;

        private static readonly Dictionary<string, (string Category, string MuscleGroup, string Difficulty)> FolderMap = new()
        {
            ["abs"]   = ("Abs",   "Core",        "Intermediate"),
            ["arms"]  = ("Arms",  "Upper Body",  "Intermediate"),
            ["chest"] = ("Chest", "Upper Body",  "Beginner"),
            ["legs"]  = ("Legs",  "Lower Body",  "Intermediate"),
        };

        private static readonly (string Title, string Desc, string Type, string Difficulty, string MuscleGroup, short DurMin, string Thumb, bool Featured, int Sort)[] WorkoutPlans =
        [
            ("Core Crusher",       "Intense ab workout to sculpt your core",           "HIIT",        "Intermediate", "Core",        20, "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80", true,  1),
            ("Chest Power",        "Build chest strength with classic presses",        "Strength",    "Beginner",     "Upper Body",  30, "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80", true,  2),
            ("Arm Day Blast",      "Biceps and triceps superset circuit",              "Strength",    "Intermediate", "Upper Body",  25, "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80", false, 3),
            ("Leg Day Madness",    "Squats, lunges and leg press endurance",           "Strength",    "Advanced",     "Lower Body",  45, "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=80", false, 4),
            ("Full Body HIIT",     "High-intensity intervals for total burn",          "HIIT",        "Advanced",     "Full Body",   35, "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80", true,  5),
            ("Morning Core Flow",  "Gentle ab activation to start the day",           "Flexibility", "Beginner",     "Core",        15, "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80", false, 6),
            ("Push-Up Power",      "Progressive push-up variations for chest",        "Strength",    "Intermediate", "Upper Body",  20, "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80", false, 7),
            ("Leg Strength Block", "Barbell squats and Romanian deadlifts",            "Strength",    "Advanced",     "Lower Body",  40, "https://images.unsplash.com/photo-1567598508481-65985588e295?w=800&q=80", false, 8),
            ("Arms & Shoulders",   "Compound arm isolation for upper strength",       "Strength",    "Intermediate", "Upper Body",  30, "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800&q=80", false, 9),
            ("Total Body Burn",    "Full-body strength conditioning circuit",          "Cardio",      "Intermediate", "Full Body",   40, "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800&q=80", false, 10),
        ];

        private static readonly Dictionary<string, string> MuscleGroupToCategoryName = new(StringComparer.OrdinalIgnoreCase)
        {
            ["Core"]        = "Abs",
            ["Upper Body"]  = "Chest",
            ["Lower Body"]  = "Legs",
            ["Full Body"]   = "Abs",
        };

        public WorkoutSeedService(ApplicationDbContext db, string uploadsRoot, ILogger<WorkoutSeedService> logger)
        {
            _db = db;
            _uploadsRoot = uploadsRoot;
            _logger = logger;
        }

        public async Task SeedAsync()
        {
            await EnsureTablesAsync();
            await EnsureColumnsAsync();
            await SeedCategoriesAsync();
            var categories = await _db.ExerciseCategories.ToDictionaryAsync(c => c.Name.ToLower());
            await SeedWorkoutVideosAsync(categories);
            await ValidateVideoFilesAsync();
            await SeedWorkoutPlansAsync(categories);
            await BackfillPrimaryVideosAsync();
        }

        private async Task EnsureTablesAsync()
        {
            // Creates the exercise_logs table on first startup if it does not yet exist.
            // Idempotent — safe to run on every startup.
            await _db.Database.ExecuteSqlRawAsync(@"
                CREATE TABLE IF NOT EXISTS `exercise_logs` (
                    `id`               INT          NOT NULL AUTO_INCREMENT,
                    `user_id`          INT          NOT NULL,
                    `exercise_id`      INT          NULL,
                    `exercise_name`    VARCHAR(200) NOT NULL DEFAULT '',
                    `body_part`        VARCHAR(100) NULL,
                    `workout_id`       INT          NULL,
                    `calories_burned`  INT          NULL,
                    `duration_seconds` INT          NULL,
                    `completed_at`     DATETIME(6)  NULL,
                    `notes`            VARCHAR(500) NULL,
                    `created_at`       DATETIME(6)  NULL,
                    `updated_at`       DATETIME(6)  NULL,
                    PRIMARY KEY (`id`),
                    KEY `IX_exercise_logs_user_completed`  (`user_id`, `completed_at`),
                    KEY `IX_exercise_logs_user_bodypart`   (`user_id`, `body_part`(100)),
                    KEY `IX_exercise_logs_exercise_id`     (`exercise_id`),
                    KEY `IX_exercise_logs_completed_at`    (`completed_at`),
                    CONSTRAINT `FK_el_users`
                        FOREIGN KEY (`user_id`)    REFERENCES `users`          (`id`) ON DELETE CASCADE,
                    CONSTRAINT `FK_el_workout_videos`
                        FOREIGN KEY (`exercise_id`) REFERENCES `workout_videos` (`id`) ON DELETE SET NULL,
                    CONSTRAINT `FK_el_workouts`
                        FOREIGN KEY (`workout_id`) REFERENCES `workouts`        (`id`) ON DELETE SET NULL
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            ");
        }

        private async Task EnsureColumnsAsync()
        {
            // Use raw ADO.NET so EF Core's command logger is bypassed entirely.
            // IF NOT EXISTS on ALTER TABLE requires MySQL 8.0.29+, so we check
            // INFORMATION_SCHEMA instead — works on all supported versions.
            var conn = _db.Database.GetDbConnection();
            bool wasOpen = conn.State == System.Data.ConnectionState.Open;
            if (!wasOpen) await conn.OpenAsync();

            try
            {
                long exists;
                using (var checkCmd = conn.CreateCommand())
                {
                    checkCmd.CommandText = @"
                        SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
                        WHERE TABLE_SCHEMA = DATABASE()
                          AND TABLE_NAME   = 'workout_videos'
                          AND COLUMN_NAME  = 'estimated_calories_burned'";
                    exists = Convert.ToInt64(await checkCmd.ExecuteScalarAsync());
                }

                if (exists == 0)
                {
                    using var alterCmd = conn.CreateCommand();
                    alterCmd.CommandText =
                        "ALTER TABLE workout_videos ADD COLUMN estimated_calories_burned INT NULL";
                    await alterCmd.ExecuteNonQueryAsync();
                }
            }
            finally
            {
                if (!wasOpen) conn.Close();
            }
        }

        private async Task SeedCategoriesAsync()
        {
            string[] bodyPart = ["Abs", "Arms", "Chest", "Legs"];
            string[] workoutTypes = ["Strength", "Cardio", "HIIT", "Yoga", "Flexibility"];

            foreach (var name in bodyPart.Concat(workoutTypes))
            {
                if (!await _db.ExerciseCategories.AnyAsync(c => c.Name == name))
                    _db.ExerciseCategories.Add(new ExerciseCategory { Name = name, Description = name });
            }
            await _db.SaveChangesAsync();
        }

        private async Task SeedWorkoutVideosAsync(Dictionary<string, ExerciseCategory> categories)
        {
            var videosPath = Path.Combine(_uploadsRoot, "videos");
            if (!Directory.Exists(videosPath)) return;

            foreach (var (folder, (catName, muscleGroup, difficulty)) in FolderMap)
            {
                var folderPath = Path.Combine(videosPath, folder);
                if (!Directory.Exists(folderPath)) continue;

                categories.TryGetValue(catName.ToLower(), out var category);

                foreach (var file in Directory.GetFiles(folderPath, "*.mp4"))
                {
                    var exerciseName = Path.GetFileNameWithoutExtension(file);
                    if (await _db.WorkoutVideos.AnyAsync(v => v.ExerciseName == exerciseName))
                        continue;

                    // FilePath is relative to the solution root so the static-files
                    // middleware at /uploads maps it to uploads/videos/{folder}/{file}
                    var relPath = $"uploads/videos/{folder}/{Path.GetFileName(file)}";

                    var fileEntity = new FileEntity
                    {
                        Entity   = "workout_video",
                        EntityId = 0, // updated below after the video row is saved
                        Filename = Path.GetFileName(file),
                        FilePath = relPath,
                        FileSize = new FileInfo(file).Length,
                    };
                    _db.Files.Add(fileEntity);
                    await _db.SaveChangesAsync();

                    var video = new WorkoutVideo
                    {
                        Title           = ToTitle(exerciseName),
                        ExerciseName    = exerciseName,
                        MuscleGroup     = muscleGroup,
                        DifficultyLevel = difficulty,
                        CategoryId      = category?.Id,
                        VideoFileId     = fileEntity.Id,
                    };
                    _db.WorkoutVideos.Add(video);
                    await _db.SaveChangesAsync();

                    // Back-fill the FK so FileEntity.EntityId points to the real video row
                    fileEntity.EntityId = video.Id;
                    await _db.SaveChangesAsync();
                }
            }
        }

        // Logs warnings for any FileEntity whose physical file is no longer on disk.
        private async Task ValidateVideoFilesAsync()
        {
            // _uploadsRoot = …/EliteBackend/uploads
            // FilePath stored as "uploads/videos/{folder}/{file}" (relative to solution root)
            var solutionRoot = Path.GetDirectoryName(_uploadsRoot)!;

            var fileEntities = await _db.Files
                .Where(f => f.Entity == "workout_video")
                .ToListAsync();

            foreach (var file in fileEntities)
            {
                var physicalPath = Path.GetFullPath(
                    Path.Combine(solutionRoot, file.FilePath.Replace('/', Path.DirectorySeparatorChar)));

                if (!File.Exists(physicalPath))
                    _logger.LogWarning(
                        "Video file missing on disk — path: {FilePath} (FileEntity Id={Id}). " +
                        "The API will return an empty videoUrl for this record.",
                        file.FilePath, file.Id);
            }
        }

        private async Task SeedWorkoutPlansAsync(Dictionary<string, ExerciseCategory> categories)
        {
            if (await _db.Workouts.AnyAsync()) return;

            foreach (var (title, desc, type, diff, muscle, dur, thumb, featured, sort) in WorkoutPlans)
            {
                categories.TryGetValue(type.ToLower(), out var cat);
                _db.Workouts.Add(new Workout
                {
                    Title        = title,
                    Description  = desc,
                    CategoryId   = cat?.Id,
                    Difficulty   = diff,
                    MuscleGroup  = muscle,
                    DurationMin  = dur,
                    ThumbnailUrl = thumb,
                    IsFeatured   = featured,
                    SortOrder    = sort,
                    CreatedAt    = DateTime.UtcNow,
                    UpdatedAt    = DateTime.UtcNow,
                });
            }
            await _db.SaveChangesAsync();
        }

        // Assigns a primary video to each workout that doesn't have one yet.
        // Rotates through available videos within each muscle-group pool so that
        // different workouts in the same group get different videos.
        private async Task BackfillPrimaryVideosAsync()
        {
            var workouts = await _db.Workouts.OrderBy(w => w.SortOrder).ToListAsync();
            if (!workouts.Any()) return;

            var videos = await _db.WorkoutVideos
                .Include(v => v.VideoFile)
                .Include(v => v.Category)
                .Where(v => v.VideoFileId != null)
                .OrderBy(v => v.Id)
                .ToListAsync();

            if (!videos.Any()) return;

            var videosByCategory = videos
                .GroupBy(v => v.Category?.Name ?? "")
                .ToDictionary(g => g.Key, g => g.ToList());

            // Per-pool cursor so each successive workout in the same group gets
            // a different video rather than the same first one
            var cursors = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);

            foreach (var workout in workouts)
            {
                string poolKey;
                List<WorkoutVideo> pool;

                if (workout.MuscleGroup != null
                    && MuscleGroupToCategoryName.TryGetValue(workout.MuscleGroup, out var catName)
                    && videosByCategory.TryGetValue(catName, out var catPool)
                    && catPool.Count > 0)
                {
                    poolKey = catName;
                    pool    = catPool;
                }
                else
                {
                    poolKey = "__all__";
                    pool    = videos;
                }

                if (!cursors.TryGetValue(poolKey, out var idx)) idx = 0;
                workout.PrimaryVideoId = pool[idx % pool.Count].Id;
                cursors[poolKey] = idx + 1;
            }

            await _db.SaveChangesAsync();
        }

        private static string ToTitle(string slug)
        {
            var words = slug.Split('-');
            return string.Join(' ', words.Select(w => w.Length > 0 ? char.ToUpper(w[0]) + w[1..] : w));
        }
    }
}
