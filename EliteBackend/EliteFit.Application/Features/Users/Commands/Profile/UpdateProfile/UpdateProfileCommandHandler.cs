using EliteFit.Domain.Interfaces.Repositories;
using MediatR;

namespace EliteFit.Application.Features.Users.Commands.Profile.UpdateProfile
{
    public class UpdateProfileCommandHandler : IRequestHandler<UpdateProfileCommand, bool>
    {
        private readonly IUserRepository _userRepository;

        public UpdateProfileCommandHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<bool> Handle(UpdateProfileCommand request, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByIdAsync(request.UserId);

            if (user == null) return false;

            // Kontrollojmë nëse po e ndryshon email-in dhe nëse ai email ekziston tashmë
            if (user.Email != request.Email)
            {
                var emailExists = await _userRepository.EmailExistsAsync(request.Email);
                if (emailExists) throw new Exception("This email is already in use.");
            }

            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            user.Email = request.Email;
           

          

            _userRepository.Update(user);
            await _userRepository.SaveChangesAsync(); // Përdorim metodën tënde

            return true;
        }
    }
}