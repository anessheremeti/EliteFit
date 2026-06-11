using EliteFit.Application.DTOs.Auth;
using EliteFit.Application.Features.Auth.Queries;
using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories;
using EliteFit.Domain.Interfaces.Repositories.Identity;
using EliteFit.Domain.Interfaces.Services;
using MediatR;

namespace EliteFit.Application.Features.Auth.Commands
{
    public record RegisterCommand(RegisterRequest Request) : IRequest<AuthResponse>;

    public class RegisterCommandHandler : IRequestHandler<RegisterCommand, AuthResponse>
    {
        private readonly IUserRepository         _userRepository;
        private readonly IRoleRepository         _roleRepository;
        private readonly IPasswordService        _passwordService;
        private readonly IJwtTokenService        _jwtService;
        private readonly IRefreshTokenRepository _refreshTokens;

        private const string DefaultRole = "Member";

        public RegisterCommandHandler(
            IUserRepository         userRepository,
            IRoleRepository         roleRepository,
            IPasswordService        passwordService,
            IJwtTokenService        jwtService,
            IRefreshTokenRepository refreshTokens)
        {
            _userRepository  = userRepository;
            _roleRepository  = roleRepository;
            _passwordService = passwordService;
            _jwtService      = jwtService;
            _refreshTokens   = refreshTokens;
        }

        public async Task<AuthResponse> Handle(RegisterCommand command, CancellationToken ct)
        {
            var req = command.Request;

            if (await _userRepository.EmailExistsAsync(req.Email.ToLowerInvariant()))
                throw new InvalidOperationException("This email is already registered.");

            var defaultRole = await _roleRepository.GetByNameAsync(DefaultRole, ct)
                ?? throw new InvalidOperationException(
                    $"Default role '{DefaultRole}' does not exist. " +
                    "Ensure the roles table has been seeded correctly before accepting registrations.");

            var user = new User
            {
                FirstName    = req.FirstName,
                LastName     = req.LastName,
                Email        = req.Email.ToLowerInvariant(),
                PasswordHash = _passwordService.Hash(req.Password),
                IsActive     = true,
                UserRoles    = new List<UserRole>
                {
                    new() { RoleId = defaultRole.Id, AssignedAt = DateTime.UtcNow }
                }
            };

            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();

            var roleNames   = new List<string> { defaultRole.Name };
            var accessToken = _jwtService.GenerateToken(user.Id, user.Email!, $"{user.FirstName} {user.LastName}", roleNames);
            var rawRefresh  = _jwtService.GenerateRefreshToken();

            await _refreshTokens.AddAsync(new RefreshToken
            {
                UserId    = user.Id,
                TokenHash = LoginQueryHandler.Hash(rawRefresh),
                ExpiresAt = DateTime.UtcNow.AddDays(_jwtService.RefreshTokenExpiryDays),
                CreatedAt = DateTime.UtcNow,
            });
            await _refreshTokens.SaveChangesAsync();

            return new AuthResponse(
                accessToken,
                rawRefresh,
                user.Email!,
                $"{user.FirstName} {user.LastName}",
                DateTime.UtcNow.AddMinutes(_jwtService.AccessTokenExpiryMinutes),
                roleNames);
        }
    }
}
