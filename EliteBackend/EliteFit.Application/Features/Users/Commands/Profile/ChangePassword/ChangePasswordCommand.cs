using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;

namespace EliteFit.Application.Features.Users.Commands.Profile.ChangePassword
{
    public record ChangePasswordCommand(int UserId, string CurrentPassword, string NewPassword) : IRequest<bool>;
}
