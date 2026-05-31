using EliteFit.Application.DTOs.Gamification;
using EliteFit.Application.Features.Gamification.Queries.QuickFixTip;
using EliteFit.Domain.Entities;
using EliteFit.Domain.Interfaces.Repositories.Gamification;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
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

        public QuickFixTipCommandHandler(IQuickFixTipRepository repository)
        {
            _repository = repository;
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
            return await _repository.AddAsync(newTip, cancellationToken);
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
