import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarIcon from '@mui/icons-material/Star';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { Box, Button, Chip, Grid, Paper, Skeleton, Tab, Tabs, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import FoodCard from '../components/FoodCard';
import FoodDetailsDialog from '../components/FoodDetailsDialog';
import { useCartActions } from '../hooks/useCartActions';
import { decreaseQuantity, increaseQuantity, selectCartCount, selectCartItems, selectPriceBreakdown } from '../store/cartSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectFoodItems, selectRestaurants, selectRestaurantStatus } from '../store/restaurantSlice';
import type { FoodItem } from '../types';
import { buildCartItem } from '../utils/cart';
import { formatPrice } from '../utils/helpers';

// Screen 4: Restaurant details and food menu
export default function RestaurantDetailsPage() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart, confirmDialog } = useCartActions();

  const status = useAppSelector(selectRestaurantStatus);
  const restaurant = useAppSelector(selectRestaurants).find((item) => item.id === restaurantId);
  const allFood = useAppSelector(selectFoodItems);
  const cartItems = useAppSelector(selectCartItems);
  const cartCount = useAppSelector(selectCartCount);
  const price = useAppSelector(selectPriceBreakdown);

  const [selectedFoodId, setSelectedFoodId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('');

  // Menu of THIS restaurant, grouped by menu category (Pizzas, Sides, Drinks ...).
  const menu = useMemo(() => {
    const items = allFood.filter((food) => food.restaurantId === restaurantId);
    const groups: Record<string, FoodItem[]> = {};
    items.forEach((food) => {
      if (!groups[food.menuCategory]) groups[food.menuCategory] = [];
      groups[food.menuCategory].push(food);
    });
    return groups;
  }, [allFood, restaurantId]);

  const categoryNames = Object.keys(menu);

  useEffect(() => {
    if (categoryNames.length > 0 && !activeCategory) setActiveCategory(categoryNames[0]);
  }, [categoryNames, activeCategory]);

  // Home page "Recommended" links here with ?food=ID, so open that dish automatically.
  useEffect(() => {
    const foodId = searchParams.get('food');
    if (foodId) setSelectedFoodId(foodId);
  }, [searchParams]);

  const closeDialog = () => {
    setSelectedFoodId(null);
    if (searchParams.has('food')) {
      const next = new URLSearchParams(searchParams);
      next.delete('food');
      setSearchParams(next, { replace: true });
    }
  };

  const goToCategory = (name: string) => {
    setActiveCategory(name);
    document.getElementById(`menu-${name}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // How many of a dish are in the cart (all sizes together).
  const quantityInCart = (foodId: string) =>
    cartItems.filter((item) => item.foodId === foodId).reduce((sum, item) => sum + item.quantity, 0);

  if (status === 'idle' || status === 'loading') {
    return (
      <Box>
        <Skeleton variant="rounded" height={220} />
        <Skeleton width="40%" height={40} sx={{ mt: 2 }} />
        <Skeleton width="70%" />
      </Box>
    );
  }

  if (!restaurant) {
    return (
      <EmptyState
        icon={<StorefrontIcon fontSize="inherit" />}
        title="Restaurant not found"
        message="This restaurant does not exist or was removed."
        actionLabel="Browse restaurants"
        onAction={() => navigate('/restaurants')}
      />
    );
  }

  const selectedFood = allFood.find((food) => food.id === selectedFoodId) ?? null;

  return (
    <Box sx={{ pb: cartCount > 0 ? 9 : 0 }}>
      {/* Banner */}
      <Box sx={{ height: { xs: 150, sm: 220 }, borderRadius: 3, overflow: 'hidden' }}>
        <img className="cover-image" src={restaurant.image} alt={restaurant.name} />
      </Box>

      {/* Restaurant information */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: 24, sm: 32 } }}>
          {restaurant.name}
        </Typography>
        <Typography color="text.secondary">{restaurant.cuisines.join(' • ')}</Typography>
        <Typography sx={{ my: 1 }}>{restaurant.description}</Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          <Chip
            icon={<StarIcon sx={{ fontSize: 16, color: '#fff !important' }} />}
            label={`${restaurant.rating.toFixed(1)} (${restaurant.reviews.toLocaleString()} reviews)`}
            color="success"
          />
          <Chip icon={<AccessTimeIcon />} label={`${restaurant.deliveryTime} mins`} variant="outlined" />
          <Chip label={`${formatPrice(restaurant.priceForTwo)} for two`} variant="outlined" />
          {restaurant.offer && <Chip label={restaurant.offer} color="primary" />}
        </Box>
      </Box>

      {/* Category navigation */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 3 }}>
        <Tabs value={activeCategory || false} onChange={(_event, value: string) => goToCategory(value)} variant="scrollable" scrollButtons="auto">
          {categoryNames.map((name) => (
            <Tab key={name} label={name} value={name} />
          ))}
        </Tabs>
      </Box>

      {/* Menu */}
      {categoryNames.map((name) => (
        <Box key={name} id={`menu-${name}`} sx={{ mt: 3, scrollMarginTop: 150 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>
            {name}
          </Typography>
          <Grid container spacing={2}>
            {menu[name].map((food) => {
              const simpleItem = buildCartItem(food, undefined, [], 1);
              return (
                <Grid item xs={12} md={6} key={food.id}>
                  <FoodCard
                    food={food}
                    cartQuantity={quantityInCart(food.id)}
                    onOpen={() => setSelectedFoodId(food.id)}
                    onAdd={() => addToCart(restaurant.name, simpleItem)}
                    onIncrease={() => dispatch(increaseQuantity(simpleItem.cartId))}
                    onDecrease={() => dispatch(decreaseQuantity(simpleItem.cartId))}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      ))}

      <FoodDetailsDialog food={selectedFood} restaurantName={restaurant.name} onClose={closeDialog} />
      {confirmDialog}

      {/* "View cart" bar at the bottom of the screen */}
      {cartCount > 0 && (
        <Paper
          elevation={8}
          sx={{ position: 'fixed', left: 0, right: 0, bottom: 0, p: 1.5, zIndex: (theme) => theme.zIndex.appBar - 1 }}
        >
          <Box sx={{ maxWidth: 'lg', mx: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
            <Typography fontWeight={600}>
              {cartCount} item{cartCount === 1 ? '' : 's'} | {formatPrice(price.subtotal)}
            </Typography>
            <Button variant="contained" onClick={() => navigate('/cart')}>
              View cart
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
}
