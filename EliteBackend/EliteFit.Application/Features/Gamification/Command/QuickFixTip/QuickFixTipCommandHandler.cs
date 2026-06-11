using EliteFit.Application.DTOs.Gamification;
using EliteFit.Application.Features.Gamification.Queries.QuickFixTip;
using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories.Gamification;
using EliteFit.Domain.Interfaces.Services;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace EliteFit.Application.Features.Gamification.Command.QuickFixTip
{
    public class QuickFixTipCommandHandler :
        IRequestHandler<GetQuickFixTipsQuery, List<QuickFixTipDto>>,
        IRequestHandler<GetQuickFixTipByIdQuery, QuickFixTipDto?>,
        IRequestHandler<CreateQuickFixTipCommand, int>,
        IRequestHandler<UpdateQuickFixTipCommand, bool>,
        IRequestHandler<DeleteQuickFixTipCommand, bool>
    {
        private readonly IQuickFixTipRepository _repository;
        private readonly INotificationService _notificationService;

        public QuickFixTipCommandHandler(IQuickFixTipRepository repository, INotificationService notificationService)
        {
            _repository = repository;
            _notificationService = notificationService;
        }

        public async Task<List<QuickFixTipDto>> Handle(GetQuickFixTipsQuery request, CancellationToken cancellationToken)
        {
            // Marrim Entitetet
            var tips = await _repository.GetAllAsync(cancellationToken);

            // Mapojmë në DTO
            return tips.Select(t => new QuickFixTipDto
            {
                Id = t.Id,
                Title = t.Title,
                Content = t.Content,
                Category = t.Category
            }).ToList();
        }

        public async Task<QuickFixTipDto?> Handle(GetQuickFixTipByIdQuery request, CancellationToken cancellationToken)
        {
            var tip = await _repository.GetByIdAsync(request.Id, cancellationToken);
            if (tip == null) return null;

            return new QuickFixTipDto
            {
                Id = tip.Id,
                Title = tip.Title,
                Content = tip.Content,
                Category = tip.Category
            };
        }

        public async Task<int> Handle(CreateQuickFixTipCommand request, CancellationToken cancellationToken)
        {
            var newTip = new EliteFit.Domain.Entities.QuickFixTip
            {
                Title = request.Title,
                Content = request.Content,
                Category = request.Category
            };

            var tipId = await _repository.AddAsync(newTip, cancellationToken);

            // RREGULLUAR: Komentuam njoftimin global pasi INotificationService nuk e suporton momentalisht.
            // Nëse shtoni metodën SendNotificationToAllAsync në të ardhmen, mund t'i hiqni komentet.

            /*
            await _notificationService.SendNotificationToAllAsync(
                "Këshillë e re e shpejtë 💡",
                $"Sapo u shtua një këshillë e re në kategorinë: {request.Category}. Shikoje tani!"
            );
            */

            return tipId;
        }

        public async Task<bool> Handle(UpdateQuickFixTipCommand request, CancellationToken cancellationToken)
        {
            var tip = await _repository.GetByIdAsync(request.Id, cancellationToken);
            if (tip == null) return false;

            tip.Title = request.Title;
            tip.Content = request.Content;
            tip.Category = request.Category;

            return await _repository.UpdateAsync(tip, cancellationToken);
        }

        public async Task<bool> Handle(DeleteQuickFixTipCommand request, CancellationToken cancellationToken)
        {
            var tip = await _repository.GetByIdAsync(request.Id, cancellationToken);
            if (tip == null) return false;

            return await _repository.DeleteAsync(tip, cancellationToken);
        }
    }
}