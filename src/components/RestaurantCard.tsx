import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import { Box, Card, CardActionArea, Chip, IconButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { selectFavouriteIds, toggleFavourite } from '../store/favouriteSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import type { Restaurant } from '../types';
import { formatPrice } from '../utils/helpers';
import { useNotifier } from './Notifier';

interface RestaurantCardProps {
  restaurant: Restaurant;
  matchedDishes?: string[]; // dishes that matched the search text
}

export default function RestaurantCard({ restaurant, matchedDishes = [] }: RestaurantCardProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { notify } = useNotifier();
  const isFavourite = useAppSelector(selectFavouriteIds).includes(restaurant.id);

  const handleFavourite = () => {
    dispatch(toggleFavourite(restaurant.id));
    notify(
      isFavourite ? `${restaurant.name} removed from favourites` : `${restaurant.name} added to favourites`,
      isFavourite ? 'info' : 'success',
    );
  };

  return (
    <Card className="card-hover" sx={{ position: 'relative', height: '100%' }}>
      <CardActionArea onClick={() => navigate(`/restaurants/${restaurant.id}`)} sx={{ height: '100%' }}>
        <Box sx={{ height: 160, position: 'relative' }}>
          <img className="cover-image" src={restaurant.image} alt={restaurant.name} loading="lazy" />
          {restaurant.offer && (
            <Chip
              label={restaurant.offer}
              size="small"
              color="primary"
              sx={{ position: 'absolute', left: 8, bottom: 8, fontWeight: 600 }}
            />
          )}
        </Box>
        <Box sx={{ p: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
            <Typography fontWeight={700} noWrap>
              {restaurant.name}
            </Typography>
            <Chip
              icon={<StarIcon sx={{ fontSize: 14, color: '#fff !important' }} />}
              label={restaurant.rating.toFixed(1)}
              size="small"
              color="success"
            />
          </Box>
          <Typography variant="body2" color="text.secondary" noWrap>
            {restaurant.cuisines.join(', ')}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, color: 'text.secondary' }}>
            <AccessTimeIcon sx={{ fontSize: 16 }} />
            <Typography variant="body2">{restaurant.deliveryTime} mins</Typography>
            <Typography variant="body2">•</Typography>
            <Typography variant="body2">{formatPrice(restaurant.priceForTwo)} for two</Typography>
          </Box>
          {matchedDishes.length > 0 && (
            <Typography variant="caption" color="primary" className="clamp-2" sx={{ mt: 0.5 }}>
              Matching dishes: {matchedDishes.join(', ')}
            </Typography>
          )}
        </Box>
      </CardActionArea>

      {/* Favourite button sits on top of the picture */}
      <IconButton
        onClick={handleFavourite}
        aria-label={isFavourite ? 'remove from favourites' : 'add to favourites'}
        sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: '#fff' } }}
        size="small"
      >
        {isFavourite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
      </IconButton>
    </Card>
  );
}
