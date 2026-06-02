using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.Features.Gamification.Command.Streak
{
    public record UpdateStreakCommand(int UserId) : IRequest<bool>;
}
