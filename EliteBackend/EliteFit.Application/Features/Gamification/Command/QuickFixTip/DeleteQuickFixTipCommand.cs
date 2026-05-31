using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.Features.Gamification.Command.QuickFixTip
{
    public record DeleteQuickFixTipCommand(int Id) : IRequest<bool>;
}
