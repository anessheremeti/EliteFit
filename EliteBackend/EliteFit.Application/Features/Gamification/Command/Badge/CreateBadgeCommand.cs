using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.Features.Gamification.Command.Badge
{
    public record CreateBadgeCommand(string Name, string? Description, int? BadgeIconId) : IRequest<int>;
}
