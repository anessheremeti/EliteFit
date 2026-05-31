using EliteFit.Application.DTOs.Recipes.query;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EliteFit.Application.Features.Recipes.Queries.GetUserRecipesList
{
    public class GetRecipesListQuery : IRequest<List<RecipeListDto>>
    {
        public int UserId { get; set; }
        public int? MaxCalories { get; set; }
        public decimal? MinProteinG { get; set; }
        // Gjenerojmë një çelës unik për secilin kombinim filtrash
        public string CacheKey => $"recipes-u:{UserId}-c:{MaxCalories ?? 0}-p:{MinProteinG ?? 0}";

        // E ruajmë në memorie për 5 minuta
        public TimeSpan? Expiration => TimeSpan.FromMinutes(5);
    }
}
