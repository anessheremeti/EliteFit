using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.Features.Gamification.Command.Settings
{
    public record UpdateSettingCommand(int Id, string Key, string? Value, string? Description) : IRequest<bool>;
}
