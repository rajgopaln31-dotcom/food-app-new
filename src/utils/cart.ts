import type { CartItem, FoodItem, Option } from '../types';

// Builds the object that goes into the cart for a chosen dish, size and add-ons.
// The final price of ONE item = base price + size extra + add-on extras.
export function buildCartItem(
  food: FoodItem,
  size: Option | undefined,
  addOns: Option[],
  quantity: number,
): CartItem {
  const extraPrice = (size?.price ?? 0) + addOns.reduce((sum, addOn) => sum + addOn.price, 0);
  const addOnKey = addOns
    .map((addOn) => addOn.id)
    .sort()
    .join(',');

  return {
    // Same dish with different size/add-ons must be a different cart line.
    cartId: `${food.id}|${size?.id ?? 'none'}|${addOnKey}`,
    foodId: food.id,
    restaurantId: food.restaurantId,
    name: food.name,
    image: food.image,
    isVeg: food.isVeg,
    sizeName: size?.name,
    addOnNames: addOns.map((addOn) => addOn.name),
    unitPrice: food.price + extraPrice,
    quantity,
  };
}

// Does this dish need the customisation dialog (size or add-ons)?
export const hasCustomisation = (food: FoodItem): boolean =>
  (food.sizes?.length ?? 0) > 0 || (food.addOns?.length ?? 0) > 0;
