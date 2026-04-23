using EliteFit.Application.DTOs.Auth;
using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories;
using EliteFit.Domain.Interfaces.Services;
using MediatR;

namespace EliteFit.Application.Features.Commands.Auth
{
    public record RegisterCommand(RegisterRequest Request) : IRequest<AuthResponse>;

    public class RegisterCommandHandler : IRequestHandler<RegisterCommand, AuthResponse>
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordService _passwordService;
        private readonly IJwtTokenService _jwtService;

        public RegisterCommandHandler(
            IUserRepository userRepository,
            IPasswordService passwordService,
            IJwtTokenService jwtService)
        {
            _userRepository = userRepository;
            _passwordService = passwordService;
            _jwtService = jwtService;
        }

        public async Task<AuthResponse> Handle(RegisterCommand command, CancellationToken cancellationToken)
        {
            var req = command.Request;

            if (await _userRepository.EmailExistsAsync(req.Email.ToLowerInvariant()))
                throw new InvalidOperationException("This email is already registered.");

            var user = new User
            {
                FirstName = req.FirstName,
                LastName = req.LastName,
                Email = req.Email.ToLowerInvariant(),
                PasswordHash = _passwordService.Hash(req.Password),
                IsActive = true
            };

            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();

            var token = _jwtService.GenerateToken(user.Id, user.Email, $"{user.FirstName} {user.LastName}");
            return new AuthResponse(token, user.Email, $"{user.FirstName} {user.LastName}", DateTime.UtcNow.AddHours(1));
        }
    }
}
