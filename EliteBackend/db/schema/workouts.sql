-- ============================================================
-- EliteFit – Workout Module Schema
-- Run order matters: exercise_categories & files already exist.
-- ============================================================

-- ── Already exists, shown for reference only ──────────────────────────────
-- files            (id INT PK, entity, entity_id, filename, file_path, ...)
-- exercise_categories (id INT PK, name, description)
-- users            (id INT PK, first_name, last_name, email, ...)
-- user_workout_history (id, user_id, video_id, calories_burned, ...)
-- ─────────────────────────────────────────────────────────────────────────

-- 1. Add missing exercise_name column to workout_videos (idempotent via INFORMATION_SCHEMA check)
SET @col_exists = (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME   = 'workout_videos'
      AND COLUMN_NAME  = 'exercise_name'
);
SET @sql = IF(@col_exists = 0,
    'ALTER TABLE workout_videos ADD COLUMN exercise_name VARCHAR(120) NOT NULL DEFAULT \'\' AFTER title',
    'SELECT ''exercise_name already exists, skipping'' AS info'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 2. Higher-level workout plans (bundles one or more videos)
CREATE TABLE IF NOT EXISTS workouts (
    id               INT               NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title            VARCHAR(120)      NOT NULL,
    description      TEXT,
    category_id      INT,
    difficulty       ENUM('Beginner','Intermediate','Advanced') NOT NULL,
    muscle_group     VARCHAR(60),
    duration_min     SMALLINT UNSIGNED NOT NULL,
    thumbnail_url    VARCHAR(512),
    primary_video_id INT,
    is_featured      BOOLEAN           NOT NULL DEFAULT FALSE,
    sort_order       INT               NOT NULL DEFAULT 0,
    created_at       DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_category    (category_id),
    INDEX idx_difficulty  (difficulty),
    INDEX idx_featured    (is_featured),
    INDEX idx_sort        (sort_order),
    FOREIGN KEY (category_id)      REFERENCES exercise_categories(id) ON DELETE SET NULL,
    FOREIGN KEY (primary_video_id) REFERENCES workout_videos(id)      ON DELETE SET NULL
);

-- 3. Per-user watch progress (enables "Continue Watching" / resume playback)
CREATE TABLE IF NOT EXISTS user_workout_progress (
    id              INT               NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id         INT               NOT NULL,
    workout_id      INT               NOT NULL,
    progress_pct    TINYINT UNSIGNED  NOT NULL DEFAULT 0,   -- 0–100
    last_watched_at DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    completed_at    DATETIME          NULL,

    UNIQUE  uq_user_workout   (user_id, workout_id),
    INDEX   idx_user_progress (user_id),
    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
    FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
);

-- 4. User favourites (heart icon on workout cards)
CREATE TABLE IF NOT EXISTS user_workout_favorites (
    user_id     INT      NOT NULL,
    workout_id  INT      NOT NULL,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (user_id, workout_id),
    INDEX idx_fav_user (user_id),
    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
    FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
);
