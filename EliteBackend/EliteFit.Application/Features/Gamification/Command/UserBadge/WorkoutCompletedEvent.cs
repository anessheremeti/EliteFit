using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.Features.Gamification.Command.UserBadge
{
    public record WorkoutCompletedEvent(int UserId, int VideoId) : INotification;
}
