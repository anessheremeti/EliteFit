using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EliteFit.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddExerciseLogs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Uses IF NOT EXISTS so the migration is safe to apply against a database
            // that was originally created outside EF Core's migration system.
            migrationBuilder.Sql(@"
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
                        FOREIGN KEY (`user_id`)     REFERENCES `users`          (`id`) ON DELETE CASCADE,
                    CONSTRAINT `FK_el_workout_videos`
                        FOREIGN KEY (`exercise_id`) REFERENCES `workout_videos`  (`id`) ON DELETE SET NULL,
                    CONSTRAINT `FK_el_workouts`
                        FOREIGN KEY (`workout_id`)  REFERENCES `workouts`        (`id`) ON DELETE SET NULL
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP TABLE IF EXISTS `exercise_logs`;");
        }
    }
}
