import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Box, Button, Card, CardActionArea, Chip, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { RestaurantGridSkeleton } from '../components/CardSkeletons';
import EmptyState from '../components/EmptyState';
import { useNotifier } from '../components/Notifier';
import RestaurantCard from '../components/RestaurantCard';
import VegIndicator from '../components/VegIndicator';
import { banners } from '../data/mockData';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  loadRestaurantData,
  selectCategories,
  selectFoodItems,
  selectRestaurants,
  selectRestaurantStatus,
} from '../store/restaurantSlice';
import { formatPrice } from '../utils/helpers';

// A heading with an optional "See all" button, used for every section of the page.
function Section({ title, onSeeAll, children }: { title: string; onSeeAll?: () => void; children: ReactNode }) {
  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
        <Typography variant="h6" fontWeight={700}>
          {title}
        </Typography>
        {onSeeAll && <Button onClick={onSeeAll}>See all</Button>}
      </Box>
      {children}
    </Box>
  );
}

// Screen 2: Home page
export default function HomePage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { notify } = useNotifier();

  const status = useAppSelector(selectRestaurantStatus);
  const categories = useAppSelector(selectCategories);
  const restaurants = useAppSelector(selectRestaurants);
  const foodItems = useAppSelector(selectFoodItems);

  const [bannerIndex, setBannerIndex] = useState(0);

  // Change the banner automatically every 4 seconds.
  useEffect(() => {
    const timer = setInterval(() => setBannerIndex((index) => (index + 1) % banners.length), 4000);
    return () => clearInterval(timer); // clean up when the page closes
  }, []);

  const banner = banners[bannerIndex];
  const isLoading = status === 'idle' || status === 'loading';

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      notify(`Coupon ${code} copied. Apply it in your cart!`, 'success');
    } catch {
      notify(`Use coupon code ${code} in your cart`, 'info');
    }
  };

  if (status === 'failed') {
    return (
      <EmptyState
        title="Could not load restaurants"
        message="Please check your connection and try again."
        actionLabel="Try again"
        onAction={() => dispatch(loadRestaurantData())}
      />
    );
  }

  // Three different ways to sort the same restaurant list.
  const popular = [...restaurants].sort((a, b) => b.reviews - a.reviews).slice(0, 4);
  const topRated = [...restaurants].sort((a, b) => b.rating - a.rating).slice(0, 4);
  const recommended = foodItems.filter((food) => food.recommended && food.available).slice(0, 8);

  return (
    <Box>
      {/* Promotional banner */}
      <Box className="banner" sx={{ backgroundImage: `url(${banner.image})` }}>
        <Box className="banner-content">
          <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: 18, sm: 26 } }}>
            {banner.title}
          </Typography>
          <Typography sx={{ mb: 2, fontSize: { xs: 13, sm: 16 } }}>{banner.subtitle}</Typography>
          <Button
            variant="contained"
            color="inherit"
            size="small"
            startIcon={<ContentCopyIcon />}
            onClick={() => copyCode(banner.couponCode)}
            sx={{ color: 'text.primary' }}
          >
            Copy {banner.couponCode}
          </Button>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }}>
        {banners.map((item, index) => (
          <Box
            key={item.id}
            onClick={() => setBannerIndex(index)}
            sx={{
              width: index === bannerIndex ? 22 : 8,
              height: 8,
              borderRadius: 4,
              bgcolor: index === bannerIndex ? 'primary.main' : 'grey.400',
              cursor: 'pointer',
              transition: 'width 0.3s',
            }}
          />
        ))}
      </Box>

      {/* Food categories */}
      <Section title="What's on your mind?">
        <Box className="hide-scrollbar" sx={{ display: 'flex', gap: 2, pb: 1 }}>
          {categories.map((category) => (
            <Box
              key={category.id}
              onClick={() => navigate(`/restaurants?category=${category.id}`)}
              sx={{ textAlign: 'center', cursor: 'pointer', minWidth: 84 }}
            >
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  mx: 'auto',
                  borderRadius: '50%',
                  bgcolor: '#fff3e6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 34,
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.1)' },
                }}
              >
                {category.emoji}
              </Box>
              <Typography variant="body2" fontWeight={500} sx={{ mt: 0.5 }}>
                {category.name}
              </Typography>
            </Box>
          ))}
        </Box>
      </Section>

      {/* Popular restaurants */}
      <Section title="Popular restaurants" onSeeAll={() => navigate('/restaurants')}>
        {isLoading ? (
          <RestaurantGridSkeleton />
        ) : (
          <Grid container spacing={2}>
            {popular.map((restaurant) => (
              <Grid item xs={12} sm={6} md={3} key={restaurant.id}>
                <RestaurantCard restaurant={restaurant} />
              </Grid>
            ))}
          </Grid>
        )}
      </Section>

      {/* Recommended food */}
      <Section title="Recommended for you">
        {isLoading ? (
          <RestaurantGridSkeleton />
        ) : (
          <Grid container spacing={2}>
            {recommended.map((food) => {
              const restaurant = restaurants.find((item) => item.id === food.restaurantId);
              return (
                <Grid item xs={6} sm={4} md={3} key={food.id}>
                  <Card variant="outlined" className="card-hover" sx={{ height: '100%' }}>
                    <CardActionArea
                      onClick={() => navigate(`/restaurants/${food.restaurantId}?food=${food.id}`)}
                      sx={{ height: '100%' }}
                    >
                      <Box sx={{ height: 120 }}>
                        <img className="cover-image" src={food.image} alt={food.name} loading="lazy" />
                      </Box>
                      <Box sx={{ p: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <VegIndicator isVeg={food.isVeg} />
                          <Typography fontWeight={600} noWrap>
                            {food.name}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {restaurant?.name}
                        </Typography>
                        <Typography fontWeight={700}>{formatPrice(food.price)}</Typography>
                      </Box>
                    </CardActionArea>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Section>

      {/* Top rated restaurants */}
      <Section title="Top rated restaurants" onSeeAll={() => navigate('/restaurants')}>
        {isLoading ? (
          <RestaurantGridSkeleton />
        ) : (
          <Grid container spacing={2}>
            {topRated.map((restaurant) => (
              <Grid item xs={12} sm={6} md={3} key={restaurant.id}>
                <RestaurantCard restaurant={restaurant} />
              </Grid>
            ))}
          </Grid>
        )}
      </Section>

      {/* Offers */}
      <Section title="Offers for you">
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {banners.map((item) => (
            <Chip key={item.id} label={`${item.title} - ${item.subtitle}`} color="primary" variant="outlined" />
          ))}
        </Box>
      </Section>
    </Box>
  );
}
