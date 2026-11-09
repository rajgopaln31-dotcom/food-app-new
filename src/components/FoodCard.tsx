import { Box, Button, Card, Chip, Typography } from '@mui/material';
import type { FoodItem } from '../types';
import { hasCustomisation } from '../utils/cart';
import { formatPrice } from '../utils/helpers';
import QuantityStepper from './QuantityStepper';
import VegIndicator from './VegIndicator';

interface FoodCardProps {
  food: FoodItem;
  cartQuantity: number; // how many of this dish are in the cart
  onOpen: () => void; // open the details / customisation dialog
  onAdd: () => void; // quick add (dishes without options)
  onIncrease: () => void;
  onDecrease: () => void;
}

export default function FoodCard({ food, cartQuantity, onOpen, onAdd, onIncrease, onDecrease }: FoodCardProps) {
  const customisable = hasCustomisation(food);

  return (
    <Card variant="outlined" sx={{ display: 'flex', height: '100%', opacity: food.available ? 1 : 0.7 }}>
      <Box sx={{ flex: 1, p: 1.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <VegIndicator isVeg={food.isVeg} />
        <Typography fontWeight={600} onClick={onOpen} sx={{ cursor: 'pointer' }}>
          {food.name}
        </Typography>
        <Typography fontWeight={600}>{formatPrice(food.price)}</Typography>
        <Typography variant="body2" color="text.secondary" className="clamp-2">
          {food.description}
        </Typography>
        {customisable && <Typography variant="caption" color="text.secondary">Customisable</Typography>}
      </Box>

      <Box sx={{ width: 130, p: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <Box sx={{ width: 110, height: 90, borderRadius: 2, overflow: 'hidden', cursor: 'pointer' }} onClick={onOpen}>
          <img className="cover-image" src={food.image} alt={food.name} loading="lazy" />
        </Box>

        {!food.available ? (
          <Chip label="Sold out" size="small" color="default" />
        ) : customisable ? (
          <>
            <Button variant="outlined" size="small" onClick={onOpen}>
              Add +
            </Button>
            {cartQuantity > 0 && (
              <Typography variant="caption" color="primary">
                {cartQuantity} in cart
              </Typography>
            )}
          </>
        ) : cartQuantity > 0 ? (
          <QuantityStepper value={cartQuantity} onIncrease={onIncrease} onDecrease={onDecrease} />
        ) : (
          <Button variant="outlined" size="small" onClick={onAdd}>
            Add +
          </Button>
        )}
      </Box>
    </Card>
  );
}
