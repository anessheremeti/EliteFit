using EliteFit.Application.DTOs.Recipes;
using EliteFit.Domain.Interfaces.Repositories;
using MediatR;

namespace EliteFit.Application.Features.Queries.Recipes
{
    public record GetRecipeFeedQuery(
        int UserId,
        string? Category,
        string? DietType,
        string? Search,
        int Page,
        int PageSize
    ) : IRequest<RecipeFeedResultDto>;

    public class GetRecipeFeedQueryHandler : IRequestHandler<GetRecipeFeedQuery, RecipeFeedResultDto>
    {
        private readonly IRecipeRepository _repo;
        public GetRecipeFeedQueryHandler(IRecipeRepository repo) => _repo = repo;

        public async Task<RecipeFeedResultDto> Handle(GetRecipeFeedQuery req, CancellationToken ct)
        {
            var page     = Math.Max(1, req.Page);
            var pageSize = Math.Clamp(req.PageSize, 1, 50);

            var (items, total) = await _repo.GetFeedAsync(
                req.UserId, req.Category, req.DietType, req.Search, page, pageSize);

            var dtos = items.Select(Map);
            return new RecipeFeedResultDto(
                dtos,
                total,
                page,
                pageSize,
                (int)Math.Ceiling(total / (double)pageSize)
            );
        }

        internal static RecipeDto Map(Domain.Entities.Recipe r) => new(
            r.Id,
            r.Title,
            r.Description,
            r.Category,
            r.DietType,
            r.Calories,
            r.ProteinG,
            r.CarbsG,
            r.FatG,
            r.PrepTimeMin,
            r.CookTimeMin,
            r.ServingsCount,
            r.ImageUrl,
            r.IsFeatured,
            r.Allergens.Select(a => a.Allergy?.Name ?? "").Where(n => n.Length > 0)
        );
    }
}
