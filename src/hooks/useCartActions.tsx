import { useState } from 'react';
import ConfirmDialog from '../components/ConfirmDialog';
import { useNotifier } from '../components/Notifier';
import { addItem, replaceCart, selectCartCount, selectCartRestaurantId, selectCartRestaurantName } from '../store/cartSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import type { CartItem } from '../types';

interface PendingItem {
  restaurantName: string;
  item: CartItem;
  onDone?: () => void;
}

// Adds food to the cart.
// If the cart already has food from ANOTHER restaurant, it first asks the user to confirm.
// Usage:  const { addToCart, confirmDialog } = useCartActions();
//         ... and put {confirmDialog} somewhere in your JSX.
export function useCartActions() {
  const dispatch = useAppDispatch();
  const { notify } = useNotifier();
  const cartCount = useAppSelector(selectCartCount);
  const cartRestaurantId = useAppSelector(selectCartRestaurantId);
  const cartRestaurantName = useAppSelector(selectCartRestaurantName);
  const [pending, setPending] = useState<PendingItem | null>(null);

  const addToCart = (restaurantName: string, item: CartItem, onDone?: () => void) => {
    const isOtherRestaurant = cartCount > 0 && cartRestaurantId !== null && cartRestaurantId !== item.restaurantId;
    if (isOtherRestaurant) {
      setPending({ restaurantName, item, onDone });
      return;
    }
    dispatch(addItem({ restaurantName, item }));
    notify(`${item.name} added to cart`, 'success');
    onDone?.();
  };

  const handleReplace = () => {
    if (!pending) return;
    dispatch(replaceCart({ restaurantName: pending.restaurantName, item: pending.item }));
    notify(`Cart replaced. ${pending.item.name} added`, 'success');
    pending.onDone?.();
    setPending(null);
  };

  const confirmDialog = (
    <ConfirmDialog
      open={pending !== null}
      title="Replace cart items?"
      message={`Your cart already has items from ${cartRestaurantName ?? 'another restaurant'}. Do you want to clear it and add items from ${pending?.restaurantName ?? 'this restaurant'}?`}
      confirmText="Yes, replace"
      cancelText="No, keep my cart"
      onConfirm={handleReplace}
      onCancel={() => setPending(null)}
    />
  );

  return { addToCart, confirmDialog };
}
