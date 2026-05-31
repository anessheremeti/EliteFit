using EliteFit.Application.DTOs.Gamification;
using EliteFit.Application.Features.Gamification.Queries.Badge;
using EliteFit.Domain.Interfaces.Repositories.Gamification;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.Features.Gamification.Command.Badge
{
    public class BadgeCommandHandler :
            IRequestHandler<GetBadgesQuery, List<BadgeDto>>,
            IRequestHandler<GetBadgeByIdQuery, BadgeDto?>,
            IRequestHandler<CreateBadgeCommand, int>,
            IRequestHandler<UpdateBadgeCommand, bool>,
            IRequestHandler<DeleteBadgeCommand, bool>
    {
        private readonly IBadgeRepository _repository;

        public BadgeCommandHandler(IBadgeRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<BadgeDto>> Handle(GetBadgesQuery request, CancellationToken cancellationToken)
        {
            var result = await _repository.GetAllWithIconsAsync(cancellationToken);

            return result.Select(r => new BadgeDto
            {
                Id = r.Badge.Id,
                Name = r.Badge.Name,
                Description = r.Badge.Description,
                BadgeIconId = r.Badge.BadgeIconId,
                IconPath = r.IconPath
            }).ToList();
        }

        public async Task<BadgeDto?> Handle(GetBadgeByIdQuery request, CancellationToken cancellationToken)
        {
            var result = await _repository.GetWithIconByIdAsync(request.Id, cancellationToken);
            if (result == null) return null;

            return new BadgeDto
            {
                Id = result.Value.Badge.Id,
                Name = result.Value.Badge.Name,
                Description = result.Value.Badge.Description,
                BadgeIconId = result.Value.Badge.BadgeIconId,
                IconPath = result.Value.IconPath
            };
        }

        public async Task<int> Handle(CreateBadgeCommand request, CancellationToken cancellationToken)
        {
            if (request.BadgeIconId.HasValue)
            {
                var fileExists = await _repository.IconExistsAsync(request.BadgeIconId.Value, cancellationToken);
                if (!fileExists) throw new ArgumentException("Ikona e specifikuar (File ID) nuk ekziston.");
            }

            var newBadge = new EliteFit.Domain.Entities.Badge
            {
                Name = request.Name,
                Description = request.Description,
                BadgeIconId = request.BadgeIconId
            };

            return await _repository.AddAsync(newBadge, cancellationToken);
        }

        public async Task<bool> Handle(UpdateBadgeCommand request, CancellationToken cancellationToken)
        {
            var badge = await _repository.GetByIdAsync(request.Id, cancellationToken);
            if (badge == null) return false;

            if (request.BadgeIconId.HasValue)
            {
                var fileExists = await _repository.IconExistsAsync(request.BadgeIconId.Value, cancellationToken);
                if (!fileExists) throw new ArgumentException("Ikona e specifikuar (File ID) nuk ekziston.");
            }

            badge.Name = request.Name;
            badge.Description = request.Description;
            badge.BadgeIconId = request.BadgeIconId;

            return await _repository.UpdateAsync(badge, cancellationToken);
        }

        public async Task<bool> Handle(DeleteBadgeCommand request, CancellationToken cancellationToken)
        {
            var badge = await _repository.GetByIdAsync(request.Id, cancellationToken);
            if (badge == null) return false;

            return await _repository.DeleteAsync(badge, cancellationToken);
        }
    }
}
