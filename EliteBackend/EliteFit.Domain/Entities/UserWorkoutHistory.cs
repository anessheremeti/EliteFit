// This entity has been refactored into ExerciseLog.
// Kept as a type alias so any external code referencing the old name continues to compile
// while emitting a deprecation warning. Remove once all consumers are migrated.
namespace EliteFit.Domain.Entities
{
    [Obsolete("Use ExerciseLog instead. This alias will be removed in a future release.")]
    public sealed class UserWorkoutHistory : ExerciseLog { }
}
