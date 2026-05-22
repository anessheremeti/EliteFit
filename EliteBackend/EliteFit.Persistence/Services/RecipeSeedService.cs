using System.Text.Json;
using EliteFit.Domain.Entities;
using EliteFit.Persistence.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace EliteFit.Persistence.Services
{
    public class RecipeSeedService
    {
        private readonly ApplicationDbContext _db;
        private readonly ILogger<RecipeSeedService> _logger;

        private static readonly JsonSerializerOptions _jsonOpts =
            new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

        // ── Ingredient helper ─────────────────────────────────────────────────────
        private static string Ing(params (string Name, string? Amount, string? Unit, string? Notes)[] items)
            => JsonSerializer.Serialize(
                items.Select(i => new { i.Name, i.Amount, i.Unit, i.Notes }),
                _jsonOpts);

        private static string Steps(params string[] steps)
            => JsonSerializer.Serialize(steps, _jsonOpts);

        // ── Seed data ─────────────────────────────────────────────────────────────
        // (title, desc, category, dietType, difficulty,
        //  cal, proteinG, carbsG, fatG, prepMin, cookMin, servings,
        //  imageUrl, isFeatured, sortOrder,
        //  allergenNames[], ingredientsJson, stepsJson)
        private static readonly (
            string Title, string Desc, string Cat, string Diet, string Difficulty,
            int Cal, decimal Pro, decimal Carb, decimal Fat,
            int Prep, int Cook, int Servings,
            string Img, bool Featured, int Sort,
            string[] Allergens, string IngredientsJson, string StepsJson)[] RecipeSeed =
        [
            (
                "Greek Yogurt Parfait",
                "Creamy yogurt layered with granola, blueberries, and a drizzle of honey.",
                "Breakfast", "Vegetarian", "Easy",
                320, 18, 45, 6, 5, 0, 1,
                "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80",
                true, 1,
                ["Milk", "Gluten"],
                Ing(
                    ("Greek yogurt", "1", "cup", null),
                    ("Granola", "1/4", "cup", null),
                    ("Fresh blueberries", "1/2", "cup", null),
                    ("Honey", "1", "tbsp", null)
                ),
                Steps(
                    "Layer Greek yogurt at the bottom of a glass or bowl.",
                    "Add a layer of granola on top of the yogurt.",
                    "Pile fresh blueberries over the granola.",
                    "Drizzle with honey and serve immediately."
                )
            ),
            (
                "Avocado Egg Toast",
                "Whole-grain toast topped with smashed avocado, poached eggs, and chili flakes.",
                "Breakfast", "Vegetarian", "Easy",
                410, 22, 38, 20, 5, 8, 2,
                "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80",
                true, 2,
                ["Eggs", "Gluten"],
                Ing(
                    ("Whole-grain bread", "2", "slices", null),
                    ("Avocado", "1", "large", "ripe"),
                    ("Eggs", "2", "large", null),
                    ("Lemon juice", "1", "tsp", null),
                    ("Chili flakes", "1/4", "tsp", null),
                    ("Salt & pepper", null, null, "to taste")
                ),
                Steps(
                    "Toast the bread slices until golden and crisp.",
                    "Halve the avocado, remove the pit, and mash the flesh with lemon juice, salt, and pepper.",
                    "Fill a saucepan with water, bring to a gentle simmer, and poach eggs for 3–4 minutes until whites are just set.",
                    "Spread mashed avocado on each toast, top with a poached egg, and sprinkle with chili flakes."
                )
            ),
            (
                "Banana Oat Smoothie",
                "Thick and filling smoothie blended with banana, oats, almond milk, and peanut butter.",
                "Breakfast", "Vegan", "Easy",
                380, 12, 60, 10, 5, 0, 1,
                "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&q=80",
                false, 3,
                ["Gluten", "Peanuts"],
                Ing(
                    ("Banana", "1", "large", "ripe, frozen for extra thickness"),
                    ("Rolled oats", "1/2", "cup", null),
                    ("Almond milk", "1", "cup", null),
                    ("Peanut butter", "1", "tbsp", null),
                    ("Ice cubes", "4", null, null)
                ),
                Steps(
                    "Add all ingredients to a blender.",
                    "Blend on high for 60 seconds until completely smooth.",
                    "Taste and adjust sweetness with a little honey if desired.",
                    "Pour into a glass and serve immediately."
                )
            ),
            (
                "Veggie Scrambled Eggs",
                "Fluffy eggs scrambled with spinach, cherry tomatoes, and feta cheese.",
                "Breakfast", "Vegetarian", "Easy",
                290, 20, 10, 18, 5, 8, 2,
                "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=800&q=80",
                false, 4,
                ["Eggs", "Milk"],
                Ing(
                    ("Eggs", "4", "large", null),
                    ("Baby spinach", "1", "handful", null),
                    ("Cherry tomatoes", "6", null, "halved"),
                    ("Feta cheese", "30", "g", "crumbled"),
                    ("Olive oil", "1", "tsp", null),
                    ("Salt & pepper", null, null, "to taste")
                ),
                Steps(
                    "Crack eggs into a bowl, season with salt and pepper, and whisk well.",
                    "Heat olive oil in a non-stick pan over medium heat.",
                    "Add cherry tomatoes and spinach; sauté for 2 minutes until spinach wilts.",
                    "Pour in the egg mixture and stir gently with a spatula until just set.",
                    "Remove from heat, crumble feta on top, and serve immediately."
                )
            ),
            (
                "Grilled Chicken Caesar Wrap",
                "Crispy romaine, grilled chicken, parmesan, and creamy Caesar dressing in a whole-wheat wrap.",
                "Lunch", "Standard", "Medium",
                520, 42, 48, 14, 10, 15, 1,
                "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&q=80",
                true, 5,
                ["Gluten", "Milk", "Eggs"],
                Ing(
                    ("Whole-wheat wrap", "1", "large", null),
                    ("Chicken breast", "150", "g", null),
                    ("Romaine lettuce", "1", "cup", "chopped"),
                    ("Parmesan cheese", "2", "tbsp", "shaved"),
                    ("Caesar dressing", "2", "tbsp", null),
                    ("Olive oil", "1", "tsp", null)
                ),
                Steps(
                    "Season chicken breast with salt, pepper, and olive oil.",
                    "Grill or pan-sear the chicken 6–7 minutes per side until cooked through. Let rest 5 minutes, then slice.",
                    "Lay the wrap flat and spread Caesar dressing evenly over the surface.",
                    "Add romaine lettuce, sliced chicken, and parmesan.",
                    "Roll the wrap tightly, slice diagonally in half, and serve."
                )
            ),
            (
                "Quinoa Buddha Bowl",
                "Roasted sweet potato, chickpeas, kale, and tahini dressing over fluffy quinoa.",
                "Lunch", "Vegan", "Medium",
                490, 18, 72, 14, 10, 25, 2,
                "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
                true, 6,
                ["Soy"],
                Ing(
                    ("Quinoa", "1/2", "cup", "dry"),
                    ("Sweet potato", "1", "medium", "diced"),
                    ("Chickpeas", "1/2", "cup", "cooked, drained"),
                    ("Kale", "1", "cup", "stems removed"),
                    ("Tahini", "2", "tbsp", null),
                    ("Lemon juice", "1", "tbsp", null),
                    ("Garlic", "1", "clove", "minced")
                ),
                Steps(
                    "Cook quinoa according to package instructions and fluff with a fork.",
                    "Toss diced sweet potato with olive oil and salt; roast at 200°C for 20 minutes.",
                    "Add chickpeas to the tray and roast 10 more minutes until lightly crisped.",
                    "Massage kale with a pinch of salt and a few drops of olive oil until tender.",
                    "Whisk together tahini, lemon juice, garlic, and 2 tbsp water to make the dressing.",
                    "Assemble bowls with quinoa, sweet potato, chickpeas, and kale; drizzle generously with dressing."
                )
            ),
            (
                "Turkey & Avocado Sandwich",
                "Sliced turkey, fresh avocado, lettuce, tomato, and mustard on sourdough bread.",
                "Lunch", "Standard", "Easy",
                480, 36, 42, 16, 5, 0, 1,
                "https://images.unsplash.com/photo-1528736235302-52922df5c122?w=800&q=80",
                false, 7,
                ["Gluten"],
                Ing(
                    ("Sourdough bread", "2", "slices", null),
                    ("Sliced turkey", "80", "g", null),
                    ("Avocado", "1/2", "medium", "sliced"),
                    ("Lettuce", "2", "leaves", null),
                    ("Tomato", "1/2", "medium", "sliced"),
                    ("Dijon mustard", "1", "tsp", null)
                ),
                Steps(
                    "Spread Dijon mustard on one slice of sourdough.",
                    "Layer turkey, avocado, lettuce, and tomato on top.",
                    "Season with salt and pepper.",
                    "Top with the second slice of bread, press gently, and slice in half."
                )
            ),
            (
                "Lentil Soup",
                "Hearty red lentil soup with cumin, turmeric, and fresh lemon juice.",
                "Lunch", "Vegan", "Easy",
                310, 18, 48, 4, 10, 30, 4,
                "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80",
                false, 8,
                [],
                Ing(
                    ("Red lentils", "1", "cup", "rinsed"),
                    ("Onion", "1", "large", "diced"),
                    ("Garlic", "3", "cloves", "minced"),
                    ("Cumin", "1", "tsp", null),
                    ("Turmeric", "1/2", "tsp", null),
                    ("Vegetable broth", "4", "cups", null),
                    ("Lemon juice", "2", "tbsp", "freshly squeezed")
                ),
                Steps(
                    "Dice the onion and mince the garlic. Sauté in olive oil over medium heat for 3 minutes until softened.",
                    "Add cumin and turmeric; stir for 30 seconds until fragrant.",
                    "Add rinsed lentils and pour in the vegetable broth.",
                    "Bring to a boil, then reduce heat and simmer for 20–25 minutes until lentils are completely soft.",
                    "Stir in lemon juice, season with salt and pepper, and serve warm with crusty bread."
                )
            ),
            (
                "Tuna Niçoise Salad",
                "Seared tuna, boiled eggs, green beans, olives, and potatoes with Dijon vinaigrette.",
                "Lunch", "Standard", "Medium",
                440, 38, 30, 16, 15, 10, 2,
                "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80",
                false, 9,
                ["Eggs", "Seafood"],
                Ing(
                    ("Tuna steak", "150", "g", null),
                    ("Eggs", "2", "large", null),
                    ("Green beans", "100", "g", "trimmed"),
                    ("Baby potatoes", "100", "g", null),
                    ("Black olives", "1/4", "cup", "pitted"),
                    ("Dijon mustard", "1", "tsp", null),
                    ("Olive oil", "2", "tbsp", null),
                    ("Red wine vinegar", "1", "tbsp", null)
                ),
                Steps(
                    "Boil potatoes until tender, about 12 minutes; drain and halve. Hard-boil eggs for 8 minutes, peel, and halve.",
                    "Blanch green beans in boiling salted water for 3 minutes, then transfer to an ice bath.",
                    "Sear tuna in a hot pan with olive oil for 2 minutes per side; it should remain pink in the centre.",
                    "Whisk together Dijon mustard, olive oil, and red wine vinegar to make the dressing.",
                    "Arrange potatoes, green beans, eggs, olives, and tuna on a platter; drizzle with dressing."
                )
            ),
            (
                "Baked Salmon with Roasted Vegetables",
                "Herb-crusted salmon fillet served with a medley of roasted asparagus, cherry tomatoes, and lemon.",
                "Dinner", "Paleo", "Easy",
                510, 45, 20, 24, 10, 20, 2,
                "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80",
                true, 10,
                ["Seafood"],
                Ing(
                    ("Salmon fillet", "200", "g", "skin-on"),
                    ("Asparagus", "100", "g", "trimmed"),
                    ("Cherry tomatoes", "1/2", "cup", null),
                    ("Lemon", "1", "whole", "sliced"),
                    ("Fresh dill", "1", "tbsp", "chopped"),
                    ("Olive oil", "2", "tbsp", null),
                    ("Garlic", "2", "cloves", "minced")
                ),
                Steps(
                    "Preheat the oven to 200°C and line a baking tray with parchment paper.",
                    "Place salmon on the tray; season with salt, pepper, dill, and lemon slices.",
                    "Toss asparagus and cherry tomatoes with olive oil, garlic, salt, and pepper; arrange around the salmon.",
                    "Bake for 18–20 minutes until the salmon flakes easily with a fork.",
                    "Squeeze fresh lemon over everything and serve straight from the tray."
                )
            ),
            (
                "Chicken Stir-Fry",
                "Tender chicken strips with broccoli, bell peppers, and snap peas in a ginger-soy glaze.",
                "Dinner", "Standard", "Medium",
                460, 40, 38, 12, 10, 15, 2,
                "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80",
                true, 11,
                ["Soy", "Gluten"],
                Ing(
                    ("Chicken breast", "200", "g", "thinly sliced"),
                    ("Broccoli", "1", "cup", "florets"),
                    ("Red bell pepper", "1", "medium", "sliced"),
                    ("Snap peas", "1/2", "cup", null),
                    ("Soy sauce", "3", "tbsp", null),
                    ("Fresh ginger", "1", "tsp", "grated"),
                    ("Garlic", "2", "cloves", "minced"),
                    ("Sesame oil", "1", "tsp", null)
                ),
                Steps(
                    "Marinate chicken strips in 1 tbsp soy sauce for 5 minutes.",
                    "Heat a wok or large pan over high heat. Add oil and stir-fry chicken 4–5 minutes until cooked. Remove and set aside.",
                    "Add broccoli, bell pepper, and snap peas; stir-fry for 3 minutes until tender-crisp.",
                    "Add ginger and garlic; cook 30 seconds until fragrant.",
                    "Return chicken to the wok, add remaining soy sauce, and toss to coat.",
                    "Drizzle with sesame oil and serve immediately over rice."
                )
            ),
            (
                "Beef & Broccoli Bowl",
                "Lean beef sirloin with tender broccoli florets in a rich umami sauce over brown rice.",
                "Dinner", "Standard", "Medium",
                580, 44, 52, 16, 10, 20, 2,
                "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
                false, 12,
                ["Soy", "Gluten"],
                Ing(
                    ("Beef sirloin", "200", "g", "thinly sliced"),
                    ("Broccoli", "2", "cups", "florets"),
                    ("Brown rice", "1/2", "cup", "dry"),
                    ("Soy sauce", "3", "tbsp", null),
                    ("Oyster sauce", "1", "tbsp", null),
                    ("Cornstarch", "1", "tsp", null),
                    ("Garlic", "2", "cloves", "minced"),
                    ("Ginger", "1", "tsp", "grated")
                ),
                Steps(
                    "Cook brown rice according to package instructions.",
                    "Toss sliced beef with cornstarch and 1 tbsp soy sauce; set aside.",
                    "Blanch broccoli in boiling water for 2 minutes; drain.",
                    "Stir-fry beef in a hot wok for 3–4 minutes until browned. Remove and set aside.",
                    "Add garlic and ginger to the wok; cook 30 seconds, then add broccoli and remaining sauce.",
                    "Return beef, toss everything together, and serve over brown rice."
                )
            ),
            (
                "Black Bean Tacos",
                "Crispy corn tortillas filled with spiced black beans, avocado, pickled onions, and salsa verde.",
                "Dinner", "Vegan", "Easy",
                420, 16, 62, 12, 15, 15, 3,
                "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80",
                false, 13,
                [],
                Ing(
                    ("Corn tortillas", "3", null, null),
                    ("Black beans", "1", "can", "drained and rinsed"),
                    ("Avocado", "1", "medium", "sliced"),
                    ("Red onion", "1/4", "small", "thinly sliced"),
                    ("Salsa verde", "3", "tbsp", null),
                    ("Lime juice", "1", "tbsp", null),
                    ("Fresh cilantro", "2", "tbsp", "chopped"),
                    ("Cumin", "1", "tsp", null)
                ),
                Steps(
                    "Heat black beans in a small pan with cumin, salt, and a splash of water until warmed through.",
                    "Pickle the red onion: combine sliced onion with lime juice and a pinch of salt; let sit 5 minutes.",
                    "Warm tortillas in a dry pan over medium heat, 30 seconds each side, until lightly charred.",
                    "Fill each tortilla with black beans, avocado slices, and pickled onion.",
                    "Spoon salsa verde on top and finish with fresh cilantro and an extra squeeze of lime."
                )
            ),
            (
                "Shrimp Cauliflower Fried Rice",
                "Low-carb fried rice using riced cauliflower, shrimp, edamame, and egg.",
                "Dinner", "Keto", "Medium",
                350, 30, 18, 16, 10, 15, 2,
                "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80",
                false, 14,
                ["Shellfish", "Eggs", "Soy"],
                Ing(
                    ("Shrimp", "200", "g", "peeled and deveined"),
                    ("Cauliflower", "1", "head", "riced"),
                    ("Eggs", "2", "large", null),
                    ("Edamame", "1/2", "cup", "shelled"),
                    ("Soy sauce", "2", "tbsp", null),
                    ("Sesame oil", "1", "tsp", null),
                    ("Garlic", "2", "cloves", "minced"),
                    ("Green onions", "2", null, "sliced")
                ),
                Steps(
                    "Rice the cauliflower: pulse florets in a food processor until they resemble coarse rice grains.",
                    "Sauté garlic in sesame oil over high heat; add shrimp and cook 2–3 minutes until pink. Remove and set aside.",
                    "Push pan contents to the side; crack in the eggs and scramble until just set.",
                    "Add cauliflower rice and edamame; stir-fry for 3–4 minutes.",
                    "Return shrimp to the pan, add soy sauce, and toss everything together.",
                    "Serve topped with sliced green onions."
                )
            ),
            (
                "Lamb Kofta with Tzatziki",
                "Grilled spiced lamb meatballs served with cool cucumber tzatziki and warm pita.",
                "Dinner", "Standard", "Medium",
                560, 38, 30, 28, 20, 15, 2,
                "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800&q=80",
                false, 15,
                ["Milk", "Gluten"],
                Ing(
                    ("Ground lamb", "300", "g", null),
                    ("Garlic", "3", "cloves", "minced"),
                    ("Cumin", "1", "tsp", null),
                    ("Ground coriander", "1", "tsp", null),
                    ("Fresh parsley", "2", "tbsp", "chopped"),
                    ("Greek yogurt", "1/2", "cup", null),
                    ("Cucumber", "1/4", null, "grated and squeezed dry"),
                    ("Fresh dill", "1", "tbsp", null),
                    ("Pita bread", "2", null, null)
                ),
                Steps(
                    "Combine lamb, garlic, cumin, coriander, parsley, salt, and pepper in a bowl. Mix until well combined.",
                    "Shape into 6–8 oval meatballs; thread onto skewers if using.",
                    "Grill or pan-fry kofta over medium-high heat for 4–5 minutes per side until cooked through.",
                    "Meanwhile, mix yogurt, grated cucumber (squeezed dry), dill, and a pinch of garlic for the tzatziki.",
                    "Warm pita directly over a flame or in a dry pan.",
                    "Serve kofta alongside tzatziki and warm pita with lemon wedges."
                )
            ),
            (
                "Apple Almond Butter Slices",
                "Crisp apple slices served with natural almond butter and a sprinkle of cinnamon.",
                "Snack", "Vegan", "Easy",
                220, 6, 28, 10, 3, 0, 1,
                "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800&q=80",
                false, 16,
                ["Tree Nuts"],
                Ing(
                    ("Apple", "1", "large", "cored"),
                    ("Almond butter", "2", "tbsp", "natural, no added sugar"),
                    ("Cinnamon", "1/4", "tsp", null),
                    ("Lemon juice", "1", "tsp", "to prevent browning")
                ),
                Steps(
                    "Core and slice the apple into even wedges or rounds.",
                    "Toss apple slices briefly in lemon juice to keep them from browning.",
                    "Arrange on a plate and serve almond butter alongside for dipping, or spread on each slice.",
                    "Sprinkle with cinnamon and enjoy immediately."
                )
            ),
            (
                "Cottage Cheese & Pineapple Cup",
                "High-protein cottage cheese bowl topped with fresh pineapple chunks and mint.",
                "Snack", "Vegetarian", "Easy",
                180, 20, 22, 2, 3, 0, 1,
                "https://images.unsplash.com/photo-1488477304112-4944851de03d?w=800&q=80",
                false, 17,
                ["Milk"],
                Ing(
                    ("Cottage cheese", "1", "cup", "low-fat"),
                    ("Fresh pineapple", "1/2", "cup", "diced"),
                    ("Fresh mint", "4", "leaves", null),
                    ("Honey", "1", "tsp", "optional")
                ),
                Steps(
                    "Spoon cottage cheese into a serving bowl or portable cup.",
                    "Top with fresh pineapple chunks.",
                    "Garnish with mint leaves.",
                    "Drizzle with honey if desired and serve chilled."
                )
            ),
            (
                "Trail Mix Energy Bites",
                "No-bake oat and nut butter energy balls packed with seeds, dark chocolate chips, and honey.",
                "Snack", "Vegetarian", "Easy",
                260, 8, 32, 12, 15, 0, 10,
                "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=800&q=80",
                false, 18,
                ["Gluten", "Tree Nuts", "Peanuts"],
                Ing(
                    ("Rolled oats", "1", "cup", null),
                    ("Nut butter", "1/2", "cup", "peanut or almond"),
                    ("Honey", "1/3", "cup", null),
                    ("Dark chocolate chips", "1/4", "cup", null),
                    ("Mixed seeds", "2", "tbsp", "chia, flax, or hemp"),
                    ("Vanilla extract", "1", "tsp", null)
                ),
                Steps(
                    "Combine all ingredients in a large bowl and mix until fully combined.",
                    "Refrigerate the mixture for 30 minutes so it firms up and is easier to shape.",
                    "Roll into 10–12 balls using damp hands to prevent sticking.",
                    "Store in an airtight container in the fridge for up to 1 week."
                )
            ),
            (
                "Post-Workout Protein Shake",
                "Fast-digesting whey shake blended with banana, oat milk, and a tablespoon of cocoa.",
                "Post-Workout", "Standard", "Easy",
                310, 30, 40, 4, 3, 0, 1,
                "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800&q=80",
                true, 19,
                ["Milk", "Gluten"],
                Ing(
                    ("Whey protein powder", "1", "scoop", "any flavour"),
                    ("Banana", "1", "medium", null),
                    ("Oat milk", "250", "ml", null),
                    ("Cocoa powder", "1", "tbsp", "unsweetened"),
                    ("Ice cubes", "4", null, null)
                ),
                Steps(
                    "Add all ingredients to a blender.",
                    "Blend on high for 30–45 seconds until smooth and creamy.",
                    "Pour into a shaker bottle or glass.",
                    "Drink within 30 minutes of your workout for optimal muscle recovery."
                )
            ),
            (
                "Chicken & Sweet Potato Recovery Bowl",
                "Shredded chicken breast, roasted sweet potato, steamed broccoli, and olive oil drizzle.",
                "Post-Workout", "Paleo", "Easy",
                540, 48, 46, 12, 10, 30, 2,
                "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80",
                true, 20,
                [],
                Ing(
                    ("Chicken breast", "200", "g", null),
                    ("Sweet potato", "1", "medium", "diced"),
                    ("Broccoli florets", "1", "cup", null),
                    ("Olive oil", "1", "tbsp", null),
                    ("Garlic powder", "1/2", "tsp", null),
                    ("Salt & pepper", null, null, "to taste")
                ),
                Steps(
                    "Preheat oven to 200°C. Toss diced sweet potato with olive oil, garlic powder, salt, and pepper.",
                    "Spread sweet potato on a lined tray and roast for 20 minutes until tender.",
                    "Season chicken breast with salt and pepper; bake alongside sweet potato for 25–30 minutes until cooked through.",
                    "Steam or blanch broccoli florets for 3–4 minutes until bright green and tender.",
                    "Shred or slice the chicken and assemble the bowl with all components.",
                    "Drizzle with a little extra olive oil before serving."
                )
            ),
            (
                "Egg White & Spinach Omelette",
                "Light egg-white omelette filled with wilted spinach, sun-dried tomatoes, and goat cheese.",
                "Post-Workout", "Vegetarian", "Easy",
                240, 28, 8, 10, 5, 8, 1,
                "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&q=80",
                false, 21,
                ["Eggs", "Milk"],
                Ing(
                    ("Egg whites", "5", "large", null),
                    ("Baby spinach", "1", "cup", null),
                    ("Sun-dried tomatoes", "3", null, "roughly chopped"),
                    ("Goat cheese", "30", "g", "crumbled"),
                    ("Olive oil", "1", "tsp", null),
                    ("Salt & pepper", null, null, "to taste")
                ),
                Steps(
                    "Whisk egg whites with a pinch of salt until slightly frothy.",
                    "Heat olive oil in a non-stick pan over medium heat.",
                    "Add spinach and sun-dried tomatoes; sauté for 1 minute until spinach wilts.",
                    "Pour egg whites over the vegetables and cook undisturbed for 2–3 minutes until edges set.",
                    "Crumble goat cheese over one half of the omelette, then fold it over.",
                    "Cook 1 more minute until the inside is just set; slide onto a plate and serve."
                )
            ),
        ];

        public RecipeSeedService(ApplicationDbContext db, ILogger<RecipeSeedService> logger)
        {
            _db = db;
            _logger = logger;
        }

        public async Task SeedAsync()
        {
            await EnsureSchemaAsync();
            await SeedRecipesAsync();
            await UpdateRecipeEnrichedDataAsync();
        }

        // ── Idempotent schema migrations ──────────────────────────────────────────

        private async Task EnsureSchemaAsync()
        {
            await EnsureRecipesTableAsync();
            await EnsureRecipeAllergensTableAsync();
            await EnsureRecipeColumnsAsync();
        }

        private async Task EnsureRecipesTableAsync()
        {
            await _db.Database.ExecuteSqlRawAsync(@"
                CREATE TABLE IF NOT EXISTS `recipes` (
                    `id`               INT          NOT NULL AUTO_INCREMENT,
                    `title`            VARCHAR(200) NOT NULL DEFAULT '',
                    `description`      VARCHAR(1000) NULL,
                    `instructions`     TEXT         NULL,
                    `calories`         INT          NULL,
                    `protein_g`        DECIMAL(6,2) NULL,
                    `carbs_g`          DECIMAL(6,2) NULL,
                    `fat_g`            DECIMAL(6,2) NULL,
                    `prep_time_min`    INT          NULL,
                    `cook_time_min`    INT          NULL,
                    `servings_count`   INT          NULL,
                    `diet_type`        VARCHAR(50)  NULL,
                    `category`         VARCHAR(100) NULL,
                    `image_url`        VARCHAR(512) NULL,
                    `is_featured`      TINYINT(1)   NOT NULL DEFAULT 0,
                    `sort_order`       INT          NOT NULL DEFAULT 0,
                    `image_file_id`    INT          NULL,
                    `difficulty_level` VARCHAR(20)  NULL,
                    `ingredients_json` TEXT         NULL,
                    `steps_json`       TEXT         NULL,
                    PRIMARY KEY (`id`),
                    KEY `IX_recipes_category`   (`category`),
                    KEY `IX_recipes_diet_type`  (`diet_type`),
                    KEY `IX_recipes_sort_order` (`sort_order`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            ");
        }

        private async Task EnsureRecipeAllergensTableAsync()
        {
            await _db.Database.ExecuteSqlRawAsync(@"
                CREATE TABLE IF NOT EXISTS `recipe_allergens` (
                    `id`          INT NOT NULL AUTO_INCREMENT,
                    `recipe_id`   INT NOT NULL,
                    `allergy_id`  INT NOT NULL,
                    PRIMARY KEY (`id`),
                    UNIQUE KEY `UX_recipe_allergens_recipe_allergy` (`recipe_id`, `allergy_id`),
                    KEY `IX_recipe_allergens_recipe_id`  (`recipe_id`),
                    KEY `IX_recipe_allergens_allergy_id` (`allergy_id`),
                    CONSTRAINT `FK_ra_recipes`   FOREIGN KEY (`recipe_id`)  REFERENCES `recipes`   (`id`) ON DELETE CASCADE,
                    CONSTRAINT `FK_ra_allergies` FOREIGN KEY (`allergy_id`) REFERENCES `allergies` (`id`) ON DELETE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            ");
        }

        private async Task EnsureRecipeColumnsAsync()
        {
            var conn = _db.Database.GetDbConnection();
            bool wasOpen = conn.State == System.Data.ConnectionState.Open;
            if (!wasOpen) await conn.OpenAsync();

            try
            {
                var columns = new[]
                {
                    ("description",      "VARCHAR(1000) NULL"),
                    ("prep_time_min",    "INT NULL"),
                    ("cook_time_min",    "INT NULL"),
                    ("servings_count",   "INT NULL"),
                    ("diet_type",        "VARCHAR(50) NULL"),
                    ("category",         "VARCHAR(100) NULL"),
                    ("image_url",        "VARCHAR(512) NULL"),
                    ("is_featured",      "TINYINT(1) NOT NULL DEFAULT 0"),
                    ("sort_order",       "INT NOT NULL DEFAULT 0"),
                    ("difficulty_level", "VARCHAR(20) NULL"),
                    ("ingredients_json", "TEXT NULL"),
                    ("steps_json",       "TEXT NULL"),
                };

                foreach (var (col, def) in columns)
                {
                    using var check = conn.CreateCommand();
                    check.CommandText = @"
                        SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
                        WHERE TABLE_SCHEMA = DATABASE()
                          AND TABLE_NAME   = 'recipes'
                          AND COLUMN_NAME  = @col";
                    var p = check.CreateParameter();
                    p.ParameterName = "@col";
                    p.Value         = col;
                    check.Parameters.Add(p);

                    var exists = Convert.ToInt64(await check.ExecuteScalarAsync()) > 0;
                    if (!exists)
                    {
                        using var alter = conn.CreateCommand();
                        alter.CommandText = $"ALTER TABLE `recipes` ADD COLUMN `{col}` {def}";
                        await alter.ExecuteNonQueryAsync();
                        _logger.LogInformation("Added column recipes.{Column}", col);
                    }
                }
            }
            finally
            {
                if (!wasOpen) conn.Close();
            }
        }

        // ── Recipe seeding ────────────────────────────────────────────────────────

        private async Task SeedRecipesAsync()
        {
            if (await _db.Recipes.AnyAsync()) return;

            var allergyMap = await _db.Allergies
                .ToDictionaryAsync(a => a.Name, a => a.Id, StringComparer.OrdinalIgnoreCase);

            var knownNames = new[] { "Peanuts", "Milk", "Eggs", "Gluten", "Seafood", "Soy", "Tree Nuts", "Shellfish" };
            foreach (var name in knownNames.Where(n => !allergyMap.ContainsKey(n)))
            {
                var a = new Allergy { Name = name };
                _db.Allergies.Add(a);
                await _db.SaveChangesAsync();
                allergyMap[name] = a.Id;
            }

            int sort = 1;
            foreach (var r in RecipeSeed)
            {
                var recipe = new Recipe
                {
                    Title            = r.Title,
                    Description      = r.Desc,
                    Category         = r.Cat,
                    DietType         = r.Diet,
                    DifficultyLevel  = r.Difficulty,
                    Calories         = r.Cal,
                    ProteinG         = r.Pro,
                    CarbsG           = r.Carb,
                    FatG             = r.Fat,
                    PrepTimeMin      = r.Prep,
                    CookTimeMin      = r.Cook,
                    ServingsCount    = r.Servings,
                    ImageUrl         = r.Img,
                    IsFeatured       = r.Featured,
                    SortOrder        = sort++,
                    IngredientsJson  = r.IngredientsJson,
                    StepsJson        = r.StepsJson,
                };
                _db.Recipes.Add(recipe);
                await _db.SaveChangesAsync();

                foreach (var allergenName in r.Allergens)
                {
                    if (!allergyMap.TryGetValue(allergenName, out var allergyId)) continue;
                    _db.RecipeAllergens.Add(new RecipeAllergenInfo
                    {
                        RecipeId  = recipe.Id,
                        AllergyId = allergyId,
                    });
                }
                await _db.SaveChangesAsync();
            }

            _logger.LogInformation("Seeded {Count} recipes.", RecipeSeed.Length);
        }

        // Patches existing seeded rows that are missing the enriched fields.
        // Idempotent: only runs when DifficultyLevel is null on at least one recipe.
        private async Task UpdateRecipeEnrichedDataAsync()
        {
            var needsUpdate = await _db.Recipes.AnyAsync(r => r.DifficultyLevel == null);
            if (!needsUpdate) return;

            var existing = await _db.Recipes.ToListAsync();
            var seedMap  = RecipeSeed.ToDictionary(r => r.Title, StringComparer.OrdinalIgnoreCase);

            foreach (var recipe in existing)
            {
                if (!seedMap.TryGetValue(recipe.Title, out var seed)) continue;
                recipe.DifficultyLevel = seed.Difficulty;
                recipe.IngredientsJson = seed.IngredientsJson;
                recipe.StepsJson       = seed.StepsJson;
            }

            await _db.SaveChangesAsync();
            _logger.LogInformation("Updated enriched data for {Count} existing recipes.", existing.Count);
        }
    }
}
