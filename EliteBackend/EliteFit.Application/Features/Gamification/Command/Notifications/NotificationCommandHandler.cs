using EliteFit.Application.DTOs.Gamification;
using EliteFit.Application.Features.Gamification.Queries.Notifications;
using EliteFit.Domain.Interfaces.Repositories.Gamification;
using MediatR;

namespace EliteFit.Application.Features.Gamification.Command.Notifications
{
    public class NotificationCommandHandler :
        IRequestHandler<GetUserNotificationsQuery, List<NotificationDto>>,
        IRequestHandler<GetUnreadCountQuery, int>,
        IRequestHandler<MarkNotificationReadCommand, bool>,
        IRequestHandler<MarkAllNotificationsReadCommand, int>,
        IRequestHandler<DeleteNotificationCommand, bool>
    {
        private readonly INotificationRepository _repository;

        public NotificationCommandHandler(INotificationRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<NotificationDto>> Handle(GetUserNotificationsQuery request, CancellationToken cancellationToken)
        {
            var notifications = await _repository.GetByUserIdAsync(request.UserId, cancellationToken);
            return notifications.Select(n => new NotificationDto
            {
                Id = n.Id,
                Type = n.Type,
                Title = n.Title,
                Message = n.Message,
                IsRead = n.IsRead,
                CreatedAt = n.CreatedAt
            }).ToList();
        }

        public async Task<int> Handle(GetUnreadCountQuery request, CancellationToken cancellationToken)
            => await _repository.GetUnreadCountAsync(request.UserId, cancellationToken);

        public async Task<bool> Handle(MarkNotificationReadCommand request, CancellationToken cancellationToken)
            => await _repository.MarkAsReadAsync(request.NotificationId, request.UserId, cancellationToken);

        public async Task<int> Handle(MarkAllNotificationsReadCommand request, CancellationToken cancellationToken)
            => await _repository.MarkAllAsReadAsync(request.UserId, cancellationToken);

        public async Task<bool> Handle(DeleteNotificationCommand request, CancellationToken cancellationToken)
            => await _repository.DeleteAsync(request.NotificationId, request.UserId, cancellationToken);
    }
}
