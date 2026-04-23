using EliteFit.Application.DTOs.Auth;
using EliteFit.Domain.Interfaces.Repositories;
using EliteFit.Domain.Interfaces.Services;
using MediatR;

namespace EliteFit.Application.Features.Queries.Auth
{
    public record LoginQuery(LoginRequest Request) : IRequest<AuthResponse>;

    public class LoginQueryHandler : IRequestHandler<LoginQuery, AuthResponse>
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordService _passwordService;
        private readonly IJwtTokenService _jwtService;

        public LoginQueryHandler(
            IUserRepository userRepository,
            IPasswordService passwordService,
            IJwtTokenService jwtService)
        {
            _userRepository = userRepository;
            _passwordService = passwordService;
            _jwtService = jwtService;
        }

        public async Task<AuthResponse> Handle(LoginQuery query, CancellationToken cancellationToken)
        {
            var req = query.Request;
            var user = await _userRepository.GetByEmailAsync(req.Email.ToLowerInvariant());

            if (user is null || !_passwordService.Verify(req.Password, user.PasswordHash!))
                throw new UnauthorizedAccessException("Invalid email or password.");

            if (!user.IsActive)
                throw new UnauthorizedAccessException("Your account has been deactivated.");

            var token = _jwtService.GenerateToken(user.Id, user.Email!, $"{user.FirstName} {user.LastName}");
            return new AuthResponse(token, user.Email!, $"{user.FirstName} {user.LastName}", DateTime.UtcNow.AddHours(1));
        }
    }
}
