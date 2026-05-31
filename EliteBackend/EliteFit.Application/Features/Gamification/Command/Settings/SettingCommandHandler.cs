using EliteFit.Application.DTOs.Gamification;
using EliteFit.Application.Features.Gamification.Queries.Settings;
using EliteFit.Domain.Interfaces.Repositories.Gamification;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.Features.Gamification.Command.Settings
{
    public class SettingCommandHandler :
         IRequestHandler<GetSettingsQuery, List<SettingDto>>,
         IRequestHandler<GetSettingByIdQuery, SettingDto?>,
         IRequestHandler<GetSettingByKeyQuery, SettingDto?>,
         IRequestHandler<CreateSettingCommand, int>,
         IRequestHandler<UpdateSettingCommand, bool>,
         IRequestHandler<DeleteSettingCommand, bool>
    {
        private readonly ISettingRepository _repository;

        public SettingCommandHandler(ISettingRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<SettingDto>> Handle(GetSettingsQuery request, CancellationToken cancellationToken)
        {
            var settings = await _repository.GetAllAsync(cancellationToken);

            return settings.Select(s => new SettingDto
            {
                Id = s.Id,
                Key = s.Key,
                Value = s.Value,
                Description = s.Description
            }).ToList();
        }

        public async Task<SettingDto?> Handle(GetSettingByIdQuery request, CancellationToken cancellationToken)
        {
            var setting = await _repository.GetByIdAsync(request.Id, cancellationToken);
            if (setting == null) return null;

            return new SettingDto { Id = setting.Id, Key = setting.Key, Value = setting.Value, Description = setting.Description };
        }

        public async Task<SettingDto?> Handle(GetSettingByKeyQuery request, CancellationToken cancellationToken)
        {
            var setting = await _repository.GetByKeyAsync(request.Key, cancellationToken);
            if (setting == null) return null;

            return new SettingDto { Id = setting.Id, Key = setting.Key, Value = setting.Value, Description = setting.Description };
        }

        public async Task<int> Handle(CreateSettingCommand request, CancellationToken cancellationToken)
        {
            // Shmangim Namespace Conflict duke specifikuar rrugën e plotë
            var newSetting = new EliteFit.Domain.Entities.Setting
            {
                Key = request.Key,
                Value = request.Value,
                Description = request.Description
            };

            return await _repository.AddAsync(newSetting, cancellationToken);
        }

        public async Task<bool> Handle(UpdateSettingCommand request, CancellationToken cancellationToken)
        {
            var setting = await _repository.GetByIdAsync(request.Id, cancellationToken);
            if (setting == null) return false;

            setting.Key = request.Key;
            setting.Value = request.Value;
            setting.Description = request.Description;

            return await _repository.UpdateAsync(setting, cancellationToken);
        }

        public async Task<bool> Handle(DeleteSettingCommand request, CancellationToken cancellationToken)
        {
            var setting = await _repository.GetByIdAsync(request.Id, cancellationToken);
            if (setting == null) return false;

            return await _repository.DeleteAsync(setting, cancellationToken);
        }
    }
}
