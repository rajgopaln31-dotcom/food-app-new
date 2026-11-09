import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  FormControlLabel,
  FormGroup,
  IconButton,
  Radio,
  RadioGroup,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useCartActions } from '../hooks/useCartActions';
import type { FoodItem } from '../types';
import { buildCartItem } from '../utils/cart';
import { formatPrice } from '../utils/helpers';
import QuantityStepper from './QuantityStepper';
import VegIndicator from './VegIndicator';

interface FoodDetailsDialogProps {
  food: FoodItem | null; // null = dialog closed
  restaurantName: string;
  onClose: () => void;
}

// Screen 5 (first half): food details with size, add-ons, quantity and live price.
export default function FoodDetailsDialog({ food, restaurantName, onClose }: FoodDetailsDialogProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { addToCart, confirmDialog } = useCartActions();

  const [sizeId, setSizeId] = useState('');
  const [addOnIds, setAddOnIds] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  // Every time a different dish is opened, reset the choices.
  useEffect(() => {
    if (food) {
      setSizeId(food.sizes?.[0]?.id ?? '');
      setAddOnIds([]);
      setQuantity(1);
    }
  }, [food]);

  if (!food) return null;

  const selectedSize = food.sizes?.find((size) => size.id === sizeId);
  const selectedAddOns = (food.addOns ?? []).filter((addOn) => addOnIds.includes(addOn.id));
  const cartItem = buildCartItem(food, selectedSize, selectedAddOns, quantity);
  const totalPrice = cartItem.unitPrice * quantity; // updates whenever a choice changes

  const toggleAddOn = (id: string) => {
    setAddOnIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  return (
    <>
      <Dialog open onClose={onClose} fullScreen={fullScreen} fullWidth maxWidth="sm">
        <Box sx={{ position: 'relative', height: 220 }}>
          <img className="cover-image" src={food.image} alt={food.name} />
          <IconButton
            onClick={onClose}
            aria-label="close"
            sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.9)' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <VegIndicator isVeg={food.isVeg} />
            <Typography variant="h6" fontWeight={700}>
              {food.name}
            </Typography>
          </Box>
          <Typography color="text.secondary" sx={{ my: 1 }}>
            {food.description}
          </Typography>
          <Typography fontWeight={700} sx={{ mb: 2 }}>
            {formatPrice(food.price)}
          </Typography>

          {food.sizes && food.sizes.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography fontWeight={600}>Choose size</Typography>
              <RadioGroup value={sizeId} onChange={(event) => setSizeId(event.target.value)}>
                {food.sizes.map((size) => (
                  <FormControlLabel
                    key={size.id}
                    value={size.id}
                    control={<Radio />}
                    label={`${size.name}${size.price > 0 ? `  (+${formatPrice(size.price)})` : ''}`}
                  />
                ))}
              </RadioGroup>
            </Box>
          )}

          {food.addOns && food.addOns.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography fontWeight={600}>Add-ons / toppings</Typography>
              <FormGroup>
                {food.addOns.map((addOn) => (
                  <FormControlLabel
                    key={addOn.id}
                    control={<Checkbox checked={addOnIds.includes(addOn.id)} onChange={() => toggleAddOn(addOn.id)} />}
                    label={`${addOn.name}  (+${formatPrice(addOn.price)})`}
                  />
                ))}
              </FormGroup>
            </Box>
          )}

          {food.available ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mt: 3 }}>
              <QuantityStepper
                value={quantity}
                min={1}
                onIncrease={() => setQuantity((value) => value + 1)}
                onDecrease={() => setQuantity((value) => value - 1)}
              />
              <Button variant="contained" size="large" sx={{ flex: 1 }} onClick={() => addToCart(restaurantName, cartItem, onClose)}>
                Add to cart - {formatPrice(totalPrice)}
              </Button>
            </Box>
          ) : (
            <Typography color="error" fontWeight={600}>
              This item is currently unavailable.
            </Typography>
          )}
        </DialogContent>
      </Dialog>
      {confirmDialog}
    </>
  );
}
