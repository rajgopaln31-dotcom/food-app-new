import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { Alert, Box, Button, Card, Chip, Divider, Grid, IconButton, Paper, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import { useNotifier } from '../components/Notifier';
import PriceSummary from '../components/PriceSummary';
import QuantityStepper from '../components/QuantityStepper';
import VegIndicator from '../components/VegIndicator';
import {
  applyCoupon,
  decreaseQuantity,
  increaseQuantity,
  removeCoupon,
  removeItem,
  selectCartItems,
  selectCartRestaurantId,
  selectCartRestaurantName,
  selectCouponCode,
  selectPriceBreakdown,
} from '../store/cartSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { formatPrice } from '../utils/helpers';
import { COUPONS, findCoupon } from '../utils/pricing';

// Screen 5 (second half): Cart
export default function CartPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { notify } = useNotifier();

  const items = useAppSelector(selectCartItems);
  const restaurantId = useAppSelector(selectCartRestaurantId);
  const restaurantName = useAppSelector(selectCartRestaurantName);
  const couponCode = useAppSelector(selectCouponCode);
  const price = useAppSelector(selectPriceBreakdown);

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  // Check the coupon and apply it if it is valid.
  const tryApplyCoupon = (code: string) => {
    const text = code.trim().toUpperCase();
    if (text === '') {
      setCouponError('Enter a coupon code');
      return;
    }
    const coupon = findCoupon(text);
    if (!coupon) {
      setCouponError('Invalid coupon code');
      return;
    }
    if (price.subtotal < coupon.minOrder) {
      setCouponError(`Add items worth ${formatPrice(coupon.minOrder - price.subtotal)} more to use ${coupon.code}`);
      return;
    }
    dispatch(applyCoupon(coupon.code));
    setCouponInput('');
    setCouponError('');
    notify(`Coupon ${coupon.code} applied`, 'success');
  };

  const handleRemove = (cartId: string, name: string) => {
    dispatch(removeItem(cartId));
    notify(`${name} removed from cart`, 'info');
  };

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<RemoveShoppingCartIcon fontSize="inherit" />}
        title="Your cart is empty"
        message="Add some tasty food from a restaurant to get started."
        actionLabel="Browse restaurants"
        onAction={() => navigate('/restaurants')}
      />
    );
  }

  const appliedCoupon = findCoupon(couponCode);
  const couponNoLongerValid = appliedCoupon !== undefined && price.subtotal < appliedCoupon.minOrder;

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Your cart
      </Typography>
      <Grid container spacing={3}>
        {/* Left: items and coupon */}
        <Grid item xs={12} md={7}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography fontWeight={600}>Ordering from {restaurantName}</Typography>
              <Button size="small" onClick={() => navigate(`/restaurants/${restaurantId}`)}>
                Add more items
              </Button>
            </Box>
            <Divider />
            {items.map((item) => (
              <Box key={item.cartId}>
                <Box sx={{ display: 'flex', gap: 2, py: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Box sx={{ width: 72, height: 72, borderRadius: 2, overflow: 'hidden', flexShrink: 0 }}>
                    <img className="cover-image" src={item.image} alt={item.name} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 140 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <VegIndicator isVeg={item.isVeg} />
                      <Typography fontWeight={600}>{item.name}</Typography>
                    </Box>
                    {(item.sizeName || item.addOnNames.length > 0) && (
                      <Typography variant="body2" color="text.secondary">
                        {[item.sizeName, ...item.addOnNames].filter(Boolean).join(', ')}
                      </Typography>
                    )}
                    <Typography variant="body2">{formatPrice(item.unitPrice)} each</Typography>
                  </Box>
                  <QuantityStepper
                    value={item.quantity}
                    onIncrease={() => dispatch(increaseQuantity(item.cartId))}
                    onDecrease={() => dispatch(decreaseQuantity(item.cartId))}
                  />
                  <Typography fontWeight={700} sx={{ minWidth: 70, textAlign: 'right' }}>
                    {formatPrice(item.unitPrice * item.quantity)}
                  </Typography>
                  <IconButton color="error" onClick={() => handleRemove(item.cartId, item.name)} aria-label={`remove ${item.name}`}>
                    <DeleteOutlineIcon />
                  </IconButton>
                </Box>
                <Divider />
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Right: coupon and price summary */}
        <Grid item xs={12} md={5}>
          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography fontWeight={700} sx={{ mb: 1 }}>
              <LocalOfferIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
              Apply coupon
            </Typography>

            {appliedCoupon ? (
              <Box>
                <Chip label={`${appliedCoupon.code} applied`} color="success" onDelete={() => dispatch(removeCoupon())} />
                {couponNoLongerValid && (
                  <Alert severity="warning" sx={{ mt: 1 }}>
                    Cart total is below {formatPrice(appliedCoupon.minOrder)}, so this coupon is not giving a discount now.
                  </Alert>
                )}
              </Box>
            ) : (
              <>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Enter coupon code"
                    value={couponInput}
                    onChange={(event) => {
                      setCouponInput(event.target.value);
                      setCouponError('');
                    }}
                    error={Boolean(couponError)}
                    helperText={couponError}
                  />
                  <Button variant="outlined" onClick={() => tryApplyCoupon(couponInput)}>
                    Apply
                  </Button>
                </Box>
                <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {COUPONS.map((coupon) => (
                    <Card key={coupon.code} variant="outlined" sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography fontWeight={700} variant="body2">
                          {coupon.code}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {coupon.description}
                        </Typography>
                      </Box>
                      <Button size="small" onClick={() => tryApplyCoupon(coupon.code)}>
                        Apply
                      </Button>
                    </Card>
                  ))}
                </Box>
              </>
            )}
          </Paper>

          <Paper variant="outlined" sx={{ p: 2 }}>
            <PriceSummary price={price} />
            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 2 }}
              disabled={items.length === 0}
              onClick={() => navigate('/checkout')}
            >
              Proceed to checkout
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
