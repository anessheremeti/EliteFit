using EliteFit.Application.DTOs.Auth;
using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories;
using EliteFit.Domain.Interfaces.Services;
using MediatR;

namespace EliteFit.Application.Features.Auth.Commands
{
    public record RegisterCommand(RegisterRequest Request) : IRequest<AuthResponse>;

    public class RegisterCommandHandler : IRequestHandler<RegisterCommand, AuthResponse>
    {
        private readonly IUserRepository _userRepository;
        private readonly IRoleRepository _roleRepository;
        private readonly IPasswordService _passwordService;
        private readonly IJwtTokenService _jwtService;

        private const string DefaultRole = "Member";

        public RegisterCommandHandler(
            IUserRepository userRepository,
            IRoleRepository roleRepository,
            IPasswordService passwordService,
            IJwtTokenService jwtService)
        {
            _userRepository = userRepository;
            _roleRepository = roleRepository;
            _passwordService = passwordService;
            _jwtService = jwtService;
        }

        public async Task<AuthResponse> Handle(RegisterCommand command, CancellationToken cancellationToken)
        {
            var req = command.Request;

            if (await _userRepository.EmailExistsAsync(req.Email.ToLowerInvariant()))
                throw new InvalidOperationException("This email is already registered.");

            // 1. Resolve the default role BEFORE writing anything to the database.
            //    Fail fast with a clear error rather than creating a user with no role.
            var defaultRole = await _roleRepository.GetByNameAsync(DefaultRole, cancellationToken)
                ?? throw new InvalidOperationException(
                    $"Default role '{DefaultRole}' does not exist. " +
                    "Ensure the roles table has been seeded correctly before accepting registrations.");

            // 2. Build the full object graph (User + UserRole) in memory.
            //    EF Core resolves the UserId foreign key automatically via the navigation
            //    property and inserts both rows inside a single implicit transaction.
            var user = new User
            {
                FirstName    = req.FirstName,
                LastName     = req.LastName,
                Email        = req.Email.ToLowerInvariant(),
                PasswordHash = _passwordService.Hash(req.Password),
                IsActive     = true,
                UserRoles    = new List<UserRole>
                {
                    new UserRole
                    {
                        RoleId     = defaultRole.Id,
                        AssignedAt = DateTime.UtcNow,
                    }
                }
            };

            // 3. Single SaveChangesAsync = one atomic DB transaction.
            //    If either the users or user_roles insert fails the whole unit rolls back.
            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();

            // 4. Return auth response with the verified role name (never hardcoded).
            var roleNames = new List<string> { defaultRole.Name };
            var token = _jwtService.GenerateToken(
                user.Id, user.Email!, $"{user.FirstName} {user.LastName}", roleNames);

            return new AuthResponse(
                token, user.Email!, $"{user.FirstName} {user.LastName}",
                DateTime.UtcNow.AddHours(1), roleNames);
        }
    }
}
