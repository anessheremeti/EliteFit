using Microsoft.AspNetCore.Mvc;

namespace EliteFit.Api.Controllers.Recipes.Queries
{
    public class GetAllergiesController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
