using EliteFit.Application.DTOs.Gamification;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.Features.Gamification.Command.Streak
{
    public record GetUserStreakQuery(int UserId) : IRequest<UserStreakDto?>;
}
