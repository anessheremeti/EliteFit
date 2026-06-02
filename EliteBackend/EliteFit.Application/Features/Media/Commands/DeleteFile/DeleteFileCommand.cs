using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;

namespace EliteFit.Application.Features.Media.Commands.DeleteFile
{
    public record DeleteFileCommand(int Id) : IRequest<bool>;
}
