using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using EliteFit.Application.DTOs.Exercise;
using EliteFit.Domain.Enums;
using MediatR;

namespace EliteFit.Application.Features.Exercise.Queries
{
    public class GetWorkoutConfigurationsQuery : IRequest<WorkoutConfigurationDto>;
    

    public class GetWorkoutConfigurationsQueryHandler : IRequestHandler<GetWorkoutConfigurationsQuery, WorkoutConfigurationDto>
    {
        public Task<WorkoutConfigurationDto> Handle(GetWorkoutConfigurationsQuery request, CancellationToken cancellationToken)
        {
            // 1. Lexojmë vlerat nga Enum i vështirësisë dhe i kthejmë në LookupDto (Id, Name)
            var difficultyLevels = Enum.GetValues(typeof(DifficultyLevel))
                .Cast<DifficultyLevel>()
                .Select(d => new LookupDto
                {
                    Id = (int)d,
                    Name = d.ToString()
                })
                .ToList();

            // 2. Lexojmë vlerat nga Enum i muskujve dhe i kthejmë në LookupDto (Id, Name)
            var muscleGroups = Enum.GetValues(typeof(MuscleGroup))
                .Cast<MuscleGroup>()
                .Select(m => new LookupDto
                {
                    Id = (int)m,
                    Name = m.ToString() 
                })
                .ToList();

            // 3. I paketojmë të dyja listat në DTO-në që do të shkojë në React
            var result = new WorkoutConfigurationDto
            {
                DifficultyLevels = difficultyLevels,
                MuscleGroups = muscleGroups
            };

            return Task.FromResult(result);
        }
    }
}