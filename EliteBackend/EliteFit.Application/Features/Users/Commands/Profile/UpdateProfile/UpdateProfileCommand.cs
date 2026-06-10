using MediatR;

namespace EliteFit.Application.Features.Users.Commands.Profile.UpdateProfile
{
    public record UpdateProfileCommand(
     int UserId,
     string FirstName,
     string LastName,
     string Email
 ) : IRequest<bool>;
}