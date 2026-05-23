namespace EliteFit.Domain.Entities
{
    public class Recipe : BaseEntity
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Instructions { get; set; }
        public int? Calories { get; set; }
        public decimal? ProteinG { get; set; }
        public decimal? CarbsG { get; set; }
        public decimal? FatG { get; set; }
        public int? PrepTimeMin { get; set; }
        public int? CookTimeMin { get; set; }
        public int? ServingsCount { get; set; }
        public string? DietType { get; set; }
        public string? Category { get; set; }
        public string? ImageUrl { get; set; }
        public bool IsFeatured { get; set; }
        public int SortOrder { get; set; }
        public int? ImageFileId { get; set; }
        public string? DifficultyLevel { get; set; }
        public string? IngredientsJson { get; set; }
        public string? StepsJson { get; set; }

        public FileEntity? ImageFile { get; set; }
        public ICollection<RecipeAllergenInfo> Allergens { get; set; } = new List<RecipeAllergenInfo>();
    }
}
