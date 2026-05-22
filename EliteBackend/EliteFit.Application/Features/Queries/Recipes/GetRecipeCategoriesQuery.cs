using EliteFit.Domain.Interfaces.Repositories;
using MediatR;

namespace EliteFit.Application.Features.Queries.Recipes
{
    public record GetRecipeCategoriesQuery : IRequest<IEnumerable<string>>;

    public class GetRecipeCategoriesQueryHandler : IRequestHandler<GetRecipeCategoriesQuery, IEnumerable<string>>
    {
        private readonly IRecipeRepository _repo;
        public GetRecipeCategoriesQueryHandler(IRecipeRepository repo) => _repo = repo;

        public async Task<IEnumerable<string>> Handle(GetRecipeCategoriesQuery req, CancellationToken ct)
            => await _repo.GetCategoriesAsync();
    }
}
