// Updated menu data for Elite Core Nutrition
// Using user's custom images only (menu-*.png, dish-*.png, Image*.png, etc.)
// Replaced old auto-generated/Mexican menu with real menu from provided source.
// State of the art: clean data structure for modern cards, search, filters.

export const menuData = {
  categories: [
    {
      id: "combination",
      name: "Combination",
      items: [
        {
          id: "combo-1",
          name: "#1. Combo",
          price: 7.00,
          image: "/images/menu-1.png",
          description: "Includes: 1 scoop of chicken salad of choice, portion of salad and choice of side. Choose a side: Potato Salad, Cup of Fruits, Coditos.",
        },
        {
          id: "combo-2",
          name: "#2. Combo",
          price: 7.50,
          image: "/images/menu-2.png",
          description: "Includes: 2 scoops of chicken salad of choice and choice of side and cup of fresh fruit.",
        },
      ],
    },
    {
      id: "main",
      name: "Main",
      items: [
        {
          id: "onion-roll",
          name: "Onion Roll Sandwich",
          price: 8.00,
          image: "/images/menu-3.png",
          description: "Includes 2 sides and a lemonade. Choose side: Spiral Pasta, Coditos, Salad, Berries.",
        },
        {
          id: "chicken-salad-scoop",
          name: "1 Scoop Chicken Salad",
          price: 7.00,
          image: "/images/dish-1.png",
          description: "Fresh chicken salad scoop. Includes 2 sides and a lemonade.",
        },
        {
          id: "vegan-sandwich",
          name: "Vegan Sandwich",
          price: 8.00,
          image: "/images/dish-2.png",
          description: "Vegetarian, vegan. Includes 2 sides and a lemonade.",
        },
      ],
    },
    {
      id: "protein-shakes",
      name: "Protein Shakes",
      items: [
        {
          id: "choco-bomb-20",
          name: "Choco Bomb Shake (20 oz)",
          price: 6.50,
          image: "/images/dish-3.png",
          description: "20 oz. Rich chocolate protein shake.",
        },
        {
          id: "choco-bomb-32",
          name: "Choco Bomb Shake (32 oz)",
          price: 7.50,
          image: "/images/dish-4.png",
          description: "32 oz. Rich chocolate protein shake.",
        },
        {
          id: "da-missy-20",
          name: "DA Missy Shake (20 oz)",
          price: 6.50,
          image: "/images/dish-5.png",
          description: "Banana, pineapple, peach, oats. 20 oz.",
        },
        {
          id: "da-missy-32",
          name: "DA Missy Shake (32 oz)",
          price: 7.50,
          image: "/images/dish-6.png",
          description: "Banana, pineapple, peach, oats. 32 oz.",
        },
        {
          id: "weekender-20",
          name: "Weekender Shake (20 oz)",
          price: 6.50,
          image: "/images/Image2.png",
          description: "Any shake with male enhancement. Choose: Strawberry, Banana, Guava, Mango, Peach, Pina Colada. 20 oz.",
        },
        {
          id: "weekender-32",
          name: "Weekender Shake (32 oz)",
          price: 7.50,
          image: "/images/Image3.png",
          description: "Any shake with male enhancement. Choose: Strawberry, Banana, Guava, Mango, Peach, Pina Colada. 32 oz.",
        },
      ],
    },
    {
      id: "juice-bar",
      name: "Juice Bar",
      items: [
        {
          id: "love-potion",
          name: "Love Potion Juice (20 oz)",
          price: 7.00,
          image: "/images/Image4.png",
          description: "Broccoli, celery, carrots and spinach. 20 oz.",
        },
        {
          id: "mean-green",
          name: "Mean Green Juice (20 oz)",
          price: 7.00,
          image: "/images/Image5.png",
          description: "Apple, celery, cucumber, ginger root, kale. 20 oz.",
        },
      ],
    },
  ],
};

// Helper to get all items flattened (useful for search later)
export const getAllMenuItems = () => {
  return menuData.categories.flatMap((category) => category.items);
};

// Helper to find item by id or name
export const findMenuItem = (identifier) => {
  const allItems = getAllMenuItems();
  return allItems.find(
    (item) => item.id === identifier || item.name === identifier
  );
};
