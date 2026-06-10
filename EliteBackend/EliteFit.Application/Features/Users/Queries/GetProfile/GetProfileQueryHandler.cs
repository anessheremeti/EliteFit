using EliteFit.Application.Features.Users.Queries.GetProfile;
using EliteFit.Domain.Interfaces.Repositories;
using MediatR;
using EliteFit.Application.DTOs.Account;

namespace EliteFit.Application.Features.Account.Queries.GetProfile
{
    public class GetProfileQueryHandler : IRequestHandler<GetProfileQuery, AccountProfileDto?>
    {
        private readonly IUserRepository _userRepository;

        public GetProfileQueryHandler(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<AccountProfileDto?> Handle(GetProfileQuery request, CancellationToken cancellationToken)
        {
            // Përdorim metodën tënde: GetByIdAsync(int id)
            var user = await _userRepository.GetByIdAsync(request.UserId);

            if (user == null) return null;

            return new AccountProfileDto
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email
            };
        }
    }
}
