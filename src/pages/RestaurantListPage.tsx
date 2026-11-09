import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import {
  Box,
  Chip,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RestaurantGridSkeleton } from '../components/CardSkeletons';
import EmptyState from '../components/EmptyState';
import RestaurantCard from '../components/RestaurantCard';
import { selectFavouriteIds } from '../store/favouriteSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  loadRestaurantData,
  selectCategories,
  selectFoodItems,
  selectRestaurants,
  selectRestaurantStatus,
} from '../store/restaurantSlice';

type SortOption = 'relevance' | 'rating' | 'time';

// Screen 3: Restaurant listing / search
export default function RestaurantListPage() {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const status = useAppSelector(selectRestaurantStatus);
  const categories = useAppSelector(selectCategories);
  const restaurants = useAppSelector(selectRestaurants);
  const foodItems = useAppSelector(selectFoodItems);
  const favouriteIds = useAppSelector(selectFavouriteIds);

  // Search text and category live in the address bar (?q=pizza&category=pizza),
  // so the Header search box and the Home page categories can control this page.
  const query = searchParams.get('q') ?? '';
  const categoryId = searchParams.get('category') ?? 'all';

  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [pureVegOnly, setPureVegOnly] = useState(false);
  const [topRatedOnly, setTopRatedOnly] = useState(false);
  const [favouritesOnly, setFavouritesOnly] = useState(false);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== 'all') next.set(key, value);
    else next.delete(key);
    setSearchParams(next, { replace: true });
  };

  // Work out which restaurants to show. useMemo = only recalculate when the inputs change.
  const results = useMemo(() => {
    const text = query.trim().toLowerCase();

    const withMatches = restaurants.map((restaurant) => {
      const matchedDishes = text
        ? foodItems
            .filter((food) => food.restaurantId === restaurant.id && food.name.toLowerCase().includes(text))
            .map((food) => food.name)
        : [];
      const nameMatches =
        restaurant.name.toLowerCase().includes(text) ||
        restaurant.cuisines.some((cuisine) => cuisine.toLowerCase().includes(text));
      return { restaurant, matchedDishes, isMatch: text === '' || nameMatches || matchedDishes.length > 0 };
    });

    const filtered = withMatches.filter(({ restaurant, isMatch }) => {
      if (!isMatch) return false;
      if (categoryId !== 'all' && !restaurant.categoryIds.includes(categoryId)) return false;
      if (pureVegOnly && !restaurant.isVegOnly) return false;
      if (topRatedOnly && restaurant.rating < 4.5) return false;
      if (favouritesOnly && !favouriteIds.includes(restaurant.id)) return false;
      return true;
    });

    if (sortBy === 'rating') filtered.sort((a, b) => b.restaurant.rating - a.restaurant.rating);
    if (sortBy === 'time') filtered.sort((a, b) => a.restaurant.deliveryTime - b.restaurant.deliveryTime);
    return filtered;
  }, [restaurants, foodItems, query, categoryId, pureVegOnly, topRatedOnly, favouritesOnly, favouriteIds, sortBy]);

  const clearAll = () => {
    setSearchParams({}, { replace: true });
    setPureVegOnly(false);
    setTopRatedOnly(false);
    setFavouritesOnly(false);
    setSortBy('relevance');
  };

  const isLoading = status === 'idle' || status === 'loading';

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Restaurants
      </Typography>

      {/* Search + sort */}
      <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search restaurants, cuisines or dishes"
          value={query}
          onChange={(event) => updateParam('q', event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: query ? (
              <InputAdornment position="end">
                <IconButton onClick={() => updateParam('q', '')} aria-label="clear search">
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ) : undefined,
          }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="sort-label">Sort by</InputLabel>
          <Select labelId="sort-label" label="Sort by" value={sortBy} onChange={(event) => setSortBy(event.target.value as SortOption)}>
            <MenuItem value="relevance">Relevance</MenuItem>
            <MenuItem value="rating">Rating (high to low)</MenuItem>
            <MenuItem value="time">Delivery time (fastest)</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Category filter chips (scroll sideways inside the row) */}
      <Box className="hide-scrollbar" sx={{ display: 'flex', gap: 1, pb: 1 }}>
        <Chip
          label="All"
          color={categoryId === 'all' ? 'primary' : 'default'}
          onClick={() => updateParam('category', 'all')}
        />
        {categories.map((category) => (
          <Chip
            key={category.id}
            label={`${category.emoji} ${category.name}`}
            color={categoryId === category.id ? 'primary' : 'default'}
            onClick={() => updateParam('category', category.id)}
            sx={{ flexShrink: 0 }}
          />
        ))}
      </Box>

      {/* Other filters */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
        <Chip
          label="Pure veg"
          variant={pureVegOnly ? 'filled' : 'outlined'}
          color={pureVegOnly ? 'success' : 'default'}
          onClick={() => setPureVegOnly(!pureVegOnly)}
        />
        <Chip
          label="Rating 4.5+"
          variant={topRatedOnly ? 'filled' : 'outlined'}
          color={topRatedOnly ? 'primary' : 'default'}
          onClick={() => setTopRatedOnly(!topRatedOnly)}
        />
        <Chip
          label="Favourites"
          variant={favouritesOnly ? 'filled' : 'outlined'}
          color={favouritesOnly ? 'error' : 'default'}
          onClick={() => setFavouritesOnly(!favouritesOnly)}
        />
      </Box>

      {status === 'failed' ? (
        <EmptyState
          title="Could not load restaurants"
          message="Please try again."
          actionLabel="Retry"
          onAction={() => dispatch(loadRestaurantData())}
        />
      ) : isLoading ? (
        <RestaurantGridSkeleton count={8} />
      ) : results.length === 0 ? (
        <EmptyState
          icon={<SearchOffIcon fontSize="inherit" />}
          title="No restaurants found"
          message="Try a different search or remove some filters."
          actionLabel="Clear search and filters"
          onAction={clearAll}
        />
      ) : (
        <>
          <Typography color="text.secondary" sx={{ mb: 1.5 }}>
            {results.length} restaurant{results.length === 1 ? '' : 's'} found
          </Typography>
          <Grid container spacing={2}>
            {results.map(({ restaurant, matchedDishes }) => (
              <Grid item xs={12} sm={6} md={3} key={restaurant.id}>
                <RestaurantCard restaurant={restaurant} matchedDishes={matchedDishes} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
}
