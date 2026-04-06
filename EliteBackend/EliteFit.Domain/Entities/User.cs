using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Domain.Entities
{
    public class User : BaseEntity
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public bool IsActive { get; set; }

        // Relations
        public UserProfile Profile { get; set; }
        public UserStreak Streak { get; set; }

        public ICollection<UserRole> UserRoles { get; set; }
        public ICollection<UserBadge> UserBadges { get; set; }
        public ICollection<UserGoal> UserGoals { get; set; }
        public ICollection<UserAllergy> UserAllergies { get; set; }
        public ICollection<Notification> Notifications { get; set; }
        public ICollection<RefreshToken> RefreshTokens { get; set; }
        public ICollection<FileEntity> UploadedFiles { get; set; }
        public ICollection<UserWorkoutHistory> WorkoutHistories { get; set; }
    }
}
