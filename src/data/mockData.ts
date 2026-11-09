import type { Banner, Category, FoodItem, Option, Restaurant } from '../types';

// ------------------------------------------------------------------
// MOCK DATA: this file replaces a real backend database.
// Images are small SVG files stored in /public/images.
// ------------------------------------------------------------------

export const LOCATIONS = ['Hyderabad', 'Bengaluru', 'Mumbai', 'Delhi', 'Chennai', 'Pune'];

export const categories: Category[] = [
  { id: 'pizza', name: 'Pizza', emoji: '🍕' },
  { id: 'burger', name: 'Burgers', emoji: '🍔' },
  { id: 'biryani', name: 'Biryani', emoji: '🍛' },
  { id: 'chinese', name: 'Chinese', emoji: '🥡' },
  { id: 'south-indian', name: 'South Indian', emoji: '🥞' },
  { id: 'north-indian', name: 'North Indian', emoji: '🍲' },
  { id: 'desserts', name: 'Desserts', emoji: '🍰' },
  { id: 'healthy', name: 'Healthy', emoji: '🥗' },
];

export const banners: Banner[] = [
  {
    id: 'b1',
    title: '50% OFF on your first order',
    subtitle: 'Use code WELCOME50 (up to ₹100 off)',
    couponCode: 'WELCOME50',
    image: '/images/banners/b1.svg',
  },
  {
    id: 'b2',
    title: 'Flat ₹50 OFF on big orders',
    subtitle: 'Use code SAVE50 on orders above ₹399',
    couponCode: 'SAVE50',
    image: '/images/banners/b2.svg',
  },
  {
    id: 'b3',
    title: 'Free delivery today',
    subtitle: 'Use code FREEDEL on orders above ₹299',
    couponCode: 'FREEDEL',
    image: '/images/banners/b3.svg',
  },
];

export const restaurants: Restaurant[] = [
  {
    id: 'r1',
    name: 'Pizza Palace',
    image: '/images/restaurants/r1.svg',
    description: 'Wood-fired pizzas, creamy pastas and Italian comfort food.',
    rating: 4.5,
    reviews: 1280,
    deliveryTime: 30,
    priceForTwo: 500,
    cuisines: ['Pizza', 'Italian'],
    categoryIds: ['pizza'],
    offer: '50% OFF up to ₹100',
    isVegOnly: false,
  },
  {
    id: 'r2',
    name: 'Burger Barn',
    image: '/images/restaurants/r2.svg',
    description: 'Juicy burgers, crispy fries and thick shakes.',
    rating: 4.2,
    reviews: 860,
    deliveryTime: 25,
    priceForTwo: 350,
    cuisines: ['Burgers', 'Fast Food'],
    categoryIds: ['burger'],
    offer: 'Flat ₹50 OFF above ₹399',
    isVegOnly: false,
  },
  {
    id: 'r3',
    name: 'Biryani Bowl',
    image: '/images/restaurants/r3.svg',
    description: 'Authentic dum biryani cooked slowly with fragrant spices.',
    rating: 4.7,
    reviews: 2300,
    deliveryTime: 40,
    priceForTwo: 600,
    cuisines: ['Biryani', 'Hyderabadi'],
    categoryIds: ['biryani', 'north-indian'],
    offer: 'Free delivery above ₹299',
    isVegOnly: false,
  },
  {
    id: 'r4',
    name: 'Dragon Wok',
    image: '/images/restaurants/r4.svg',
    description: 'Indo-Chinese noodles, rice and spicy starters.',
    rating: 4.1,
    reviews: 640,
    deliveryTime: 35,
    priceForTwo: 450,
    cuisines: ['Chinese', 'Asian'],
    categoryIds: ['chinese'],
    isVegOnly: false,
  },
  {
    id: 'r5',
    name: 'Dosa Corner',
    image: '/images/restaurants/r5.svg',
    description: 'Crispy dosas, soft idlis and filter coffee. 100% pure veg.',
    rating: 4.6,
    reviews: 1900,
    deliveryTime: 20,
    priceForTwo: 250,
    cuisines: ['South Indian', 'Breakfast'],
    categoryIds: ['south-indian'],
    offer: '20% OFF on breakfast',
    isVegOnly: true,
  },
  {
    id: 'r6',
    name: 'Sweet Tooth',
    image: '/images/restaurants/r6.svg',
    description: 'Cakes, brownies, ice creams and Indian sweets. 100% veg.',
    rating: 4.4,
    reviews: 720,
    deliveryTime: 25,
    priceForTwo: 300,
    cuisines: ['Desserts', 'Bakery'],
    categoryIds: ['desserts'],
    isVegOnly: true,
  },
  {
    id: 'r7',
    name: 'Green Bowl',
    image: '/images/restaurants/r7.svg',
    description: 'Fresh salads, protein bowls and cold-pressed juices.',
    rating: 4.3,
    reviews: 410,
    deliveryTime: 30,
    priceForTwo: 400,
    cuisines: ['Healthy', 'Salads'],
    categoryIds: ['healthy'],
    isVegOnly: false,
  },
  {
    id: 'r8',
    name: 'Tandoor Tales',
    image: '/images/restaurants/r8.svg',
    description: 'Rich North Indian curries, fresh naans and tandoori grills.',
    rating: 4.0,
    reviews: 520,
    deliveryTime: 45,
    priceForTwo: 550,
    cuisines: ['North Indian', 'Tandoori'],
    categoryIds: ['north-indian'],
    isVegOnly: false,
  },
];

// ---------- Customisation choices that many dishes share ----------
const pizzaSizes: Option[] = [
  { id: 'regular', name: 'Regular', price: 0 },
  { id: 'medium', name: 'Medium', price: 70 },
  { id: 'large', name: 'Large', price: 140 },
];
const pizzaToppings: Option[] = [
  { id: 'cheese', name: 'Extra Cheese', price: 40 },
  { id: 'olives', name: 'Olives', price: 30 },
  { id: 'jalapenos', name: 'Jalapeños', price: 30 },
];
const burgerAddOns: Option[] = [
  { id: 'cheese-slice', name: 'Cheese Slice', price: 25 },
  { id: 'fried-egg', name: 'Fried Egg', price: 30 },
];
const biryaniSizes: Option[] = [
  { id: 'half', name: 'Half', price: 0 },
  { id: 'full', name: 'Full', price: 120 },
];
const biryaniAddOns: Option[] = [
  { id: 'raita', name: 'Extra Raita', price: 30 },
  { id: 'egg', name: 'Boiled Egg', price: 25 },
  { id: 'gravy', name: 'Extra Gravy', price: 20 },
];
const dessertAddOns: Option[] = [
  { id: 'ice-cream', name: 'Ice Cream Scoop', price: 40 },
  { id: 'choco', name: 'Chocolate Sauce', price: 25 },
];
const dosaAddOns: Option[] = [
  { id: 'extra-chutney', name: 'Extra Chutney', price: 10 },
  { id: 'butter', name: 'Extra Butter', price: 15 },
];

// A tiny helper so each dish needs only ONE line below.
function food(
  restaurantId: string,
  number: number,
  menuCategory: string,
  name: string,
  description: string,
  price: number,
  isVeg: boolean,
  extra: Partial<FoodItem> = {},
): FoodItem {
  const id = `${restaurantId}-${number}`;
  return {
    id,
    restaurantId,
    menuCategory,
    name,
    description,
    price,
    image: `/images/foods/${id}.svg`,
    isVeg,
    available: true,
    recommended: false,
    ...extra,
  };
}

export const foodItems: FoodItem[] = [
  // ----- Pizza Palace -----
  food('r1', 1, 'Pizzas', 'Margherita Pizza', 'Classic tomato sauce, mozzarella and fresh basil.', 249, true, { sizes: pizzaSizes, addOns: pizzaToppings, recommended: true }),
  food('r1', 2, 'Pizzas', 'Farmhouse Pizza', 'Loaded with capsicum, onion, mushroom and sweet corn.', 329, true, { sizes: pizzaSizes, addOns: pizzaToppings }),
  food('r1', 3, 'Pizzas', 'Pepperoni Pizza', 'Spicy pepperoni slices over melted cheese.', 379, false, { sizes: pizzaSizes, addOns: pizzaToppings, recommended: true }),
  food('r1', 4, 'Sides', 'Garlic Bread', 'Toasted bread with garlic butter and herbs.', 129, true),
  food('r1', 5, 'Sides', 'Creamy Alfredo Pasta', 'Penne tossed in a rich white sauce.', 219, true),
  food('r1', 6, 'Desserts', 'Tiramisu Cup', 'Coffee flavoured Italian dessert.', 159, true, { available: false }),

  // ----- Burger Barn -----
  food('r2', 1, 'Burgers', 'Classic Veg Burger', 'Crispy veg patty, lettuce, tomato and mayo.', 129, true, { addOns: burgerAddOns }),
  food('r2', 2, 'Burgers', 'Cheese Chicken Burger', 'Grilled chicken patty with melted cheese.', 189, false, { addOns: burgerAddOns, recommended: true }),
  food('r2', 3, 'Burgers', 'Double Patty Burger', 'Two juicy chicken patties, double the fun.', 249, false, { addOns: burgerAddOns }),
  food('r2', 4, 'Sides', 'French Fries', 'Golden crispy salted fries.', 99, true),
  food('r2', 5, 'Sides', 'Chicken Nuggets', 'Six crunchy chicken nuggets with dip.', 149, false),
  food('r2', 6, 'Drinks', 'Chocolate Shake', 'Thick shake made with real chocolate.', 139, true),

  // ----- Biryani Bowl -----
  food('r3', 1, 'Biryani', 'Chicken Dum Biryani', 'Slow cooked basmati rice with tender chicken.', 299, false, { sizes: biryaniSizes, addOns: biryaniAddOns, recommended: true }),
  food('r3', 2, 'Biryani', 'Mutton Biryani', 'Rich mutton pieces layered with spiced rice.', 399, false, { sizes: biryaniSizes, addOns: biryaniAddOns }),
  food('r3', 3, 'Biryani', 'Veg Biryani', 'Fresh vegetables and aromatic rice.', 229, true, { sizes: biryaniSizes, addOns: biryaniAddOns }),
  food('r3', 4, 'Starters', 'Chicken 65', 'Spicy deep fried chicken with curry leaves.', 189, false),
  food('r3', 5, 'Starters', 'Paneer Tikka', 'Grilled paneer cubes marinated in spices.', 199, true),
  food('r3', 6, 'Desserts', 'Double Ka Meetha', 'Traditional Hyderabadi bread pudding.', 99, true),

  // ----- Dragon Wok -----
  food('r4', 1, 'Noodles & Rice', 'Veg Hakka Noodles', 'Stir fried noodles with crunchy vegetables.', 169, true),
  food('r4', 2, 'Noodles & Rice', 'Chicken Fried Rice', 'Wok tossed rice with chicken and egg.', 199, false, { recommended: true }),
  food('r4', 3, 'Starters', 'Veg Manchurian', 'Vegetable balls in tangy garlic sauce.', 159, true),
  food('r4', 4, 'Starters', 'Chilli Chicken', 'Boneless chicken tossed with capsicum and chilli.', 219, false),
  food('r4', 5, 'Starters', 'Veg Spring Rolls', 'Crispy rolls stuffed with cabbage and carrot.', 129, true),
  food('r4', 6, 'Soups', 'Hot & Sour Soup', 'Spicy and tangy vegetable soup.', 119, true),

  // ----- Dosa Corner -----
  food('r5', 1, 'Dosas', 'Masala Dosa', 'Crispy dosa filled with spiced potato masala.', 90, true, { addOns: dosaAddOns, recommended: true }),
  food('r5', 2, 'Dosas', 'Ghee Podi Dosa', 'Dosa roasted in ghee with spicy podi powder.', 110, true, { addOns: dosaAddOns }),
  food('r5', 3, 'Breakfast', 'Idli Sambar (3 pcs)', 'Soft steamed idlis with sambar and chutneys.', 60, true),
  food('r5', 4, 'Breakfast', 'Medu Vada (2 pcs)', 'Crispy lentil doughnuts with chutney.', 70, true),
  food('r5', 5, 'Breakfast', 'Ven Pongal', 'Creamy rice and moong dal with pepper and ghee.', 80, true),
  food('r5', 6, 'Beverages', 'Filter Coffee', 'Strong South Indian style coffee.', 40, true),

  // ----- Sweet Tooth -----
  food('r6', 1, 'Cakes & Brownies', 'Chocolate Brownie', 'Warm fudgy brownie with chocolate chips.', 120, true, { addOns: dessertAddOns, recommended: true }),
  food('r6', 2, 'Cakes & Brownies', 'Red Velvet Pastry', 'Soft red velvet with cream cheese frosting.', 140, true, { addOns: dessertAddOns }),
  food('r6', 3, 'Indian Sweets', 'Gulab Jamun (4 pcs)', 'Soft milk dumplings soaked in sugar syrup.', 90, true),
  food('r6', 4, 'Ice Creams', 'Vanilla Ice Cream', 'Creamy classic vanilla.', 80, true, { addOns: dessertAddOns }),
  food('r6', 5, 'Shakes', 'Mango Shake', 'Fresh mango blended with chilled milk.', 120, true),
  food('r6', 6, 'Shakes', 'Cold Coffee', 'Chilled coffee with ice cream.', 110, true),

  // ----- Green Bowl -----
  food('r7', 1, 'Salads', 'Caesar Salad', 'Lettuce, croutons, parmesan and Caesar dressing.', 229, true),
  food('r7', 2, 'Bowls', 'Grilled Chicken Bowl', 'Grilled chicken with brown rice and veggies.', 299, false, { recommended: true }),
  food('r7', 3, 'Bowls', 'Quinoa Veg Bowl', 'Protein rich quinoa with roasted vegetables.', 269, true),
  food('r7', 4, 'Drinks', 'Fruit Smoothie', 'Strawberry and banana smoothie.', 149, true),
  food('r7', 5, 'Breakfast', 'Avocado Toast', 'Multigrain toast topped with smashed avocado.', 199, true),
  food('r7', 6, 'Drinks', 'Green Detox Juice', 'Spinach, apple and cucumber juice.', 119, true, { available: false }),

  // ----- Tandoor Tales -----
  food('r8', 1, 'Curries', 'Butter Chicken', 'Tender chicken in a creamy tomato gravy.', 329, false, { recommended: true }),
  food('r8', 2, 'Curries', 'Paneer Butter Masala', 'Soft paneer in a rich buttery gravy.', 279, true),
  food('r8', 3, 'Breads & Rice', 'Butter Naan', 'Soft tandoor baked bread brushed with butter.', 45, true),
  food('r8', 4, 'Tandoor', 'Tandoori Chicken', 'Smoky chicken marinated in yogurt and spices.', 349, false),
  food('r8', 5, 'Curries', 'Dal Makhani', 'Slow cooked black lentils with cream.', 229, true),
  food('r8', 6, 'Breads & Rice', 'Jeera Rice', 'Basmati rice tempered with cumin.', 119, true),
];
