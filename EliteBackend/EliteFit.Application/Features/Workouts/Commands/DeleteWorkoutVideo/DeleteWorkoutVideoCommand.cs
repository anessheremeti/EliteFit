using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.Features.Workouts.Commands.DeleteWorkoutVideo
{
    public class DeleteWorkoutVideoCommand : IRequest<bool>
    {
        public int Id { get; set; }

        public DeleteWorkoutVideoCommand(int id)
        {
            Id = id;
        }
    }
}
