namespace EliteFit.Application.DTOs.ExerciseLog
{
    public record BodyPartStat(
        string BodyPart,
        int TotalCalories,
        int TotalSeconds,
        int SessionCount
    );

    public record ExerciseSummaryDto(
        int TotalSessions,
        int TotalCalories,
        int TotalSeconds,
        IEnumerable<BodyPartStat> ByBodyPart
    );
}
