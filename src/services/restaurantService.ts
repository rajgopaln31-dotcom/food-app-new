import { categories, foodItems, restaurants } from '../data/mockData';
import type { Category, FoodItem, Restaurant } from '../types';
import { delay } from '../utils/helpers';

// MOCK restaurant API. Each function returns a Promise, exactly like a real fetch() would,
// so the UI code does not change when you connect a real backend later.

export interface RestaurantData {
  categories: Category[];
  restaurants: Restaurant[];
  foodItems: FoodItem[];
}

export async function fetchRestaurantData(): Promise<RestaurantData> {
  await delay(900);
  return { categories, restaurants, foodItems };
}
