using EliteFit.Application.DTOs.Exercise;
using MediatR;

namespace EliteFit.Application.Features.Exercise.Queries.GetWorkoutConfigurations
{
    public class GetWorkoutConfigurationsQuery : IRequest<WorkoutConfigurationDto>;
}