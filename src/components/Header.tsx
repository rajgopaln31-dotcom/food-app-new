import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {
  AppBar,
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  InputBase,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Toolbar,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import type { FormEvent, MouseEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LOCATIONS } from '../data/mockData';
import { selectDeliveryLocation, setDeliveryLocation } from '../store/addressSlice';
import { logout } from '../store/authSlice';
import { selectCartCount } from '../store/cartSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import Logo from './Logo';
import { useNotifier } from './Notifier';

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { notify } = useNotifier();
  const [searchParams] = useSearchParams();

  const user = useAppSelector((state) => state.auth.user);
  const cartCount = useAppSelector(selectCartCount);
  const location = useAppSelector(selectDeliveryLocation);

  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [locationAnchor, setLocationAnchor] = useState<HTMLElement | null>(null);
  const [profileAnchor, setProfileAnchor] = useState<HTMLElement | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Keep the search box in sync with the address bar (?q=pizza).
  useEffect(() => {
    setQuery(searchParams.get('q') ?? '');
  }, [searchParams]);

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    const text = query.trim();
    navigate(text ? `/restaurants?q=${encodeURIComponent(text)}` : '/restaurants');
  };

  const handleLogout = () => {
    setProfileAnchor(null);
    setDrawerOpen(false);
    dispatch(logout());
    notify('You have been logged out', 'info');
    navigate('/login');
  };

  const go = (path: string) => {
    setProfileAnchor(null);
    setDrawerOpen(false);
    navigate(path);
  };

  // The search bar is used twice (next to the logo on big screens, below it on phones).
  const searchBar = (
    <Paper
      component="form"
      onSubmit={handleSearch}
      variant="outlined"
      sx={{ display: 'flex', alignItems: 'center', px: 1.5, width: '100%' }}
    >
      <SearchIcon color="action" />
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search for restaurants or food"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        inputProps={{ 'aria-label': 'search' }}
      />
      <Button type="submit" size="small">
        Search
      </Button>
    </Paper>
  );

  const menuLinks = [
    { label: 'Home', path: '/', icon: <HomeIcon /> },
    { label: 'Restaurants', path: '/restaurants', icon: <RestaurantIcon /> },
    { label: 'My Orders', path: '/orders', icon: <ReceiptLongIcon /> },
    { label: 'Cart', path: '/cart', icon: <ShoppingCartIcon /> },
  ];

  return (
    <AppBar position="sticky" color="inherit" elevation={1}>
      <Toolbar sx={{ gap: 1 }}>
        {/* Hamburger button: phones and tablets only */}
        <IconButton sx={{ display: { md: 'none' } }} onClick={() => setDrawerOpen(true)} aria-label="open menu">
          <MenuIcon />
        </IconButton>

        <Logo />

        {/* Delivery location */}
        <Button
          color="inherit"
          startIcon={<LocationOnIcon color="primary" />}
          endIcon={<ArrowDropDownIcon />}
          onClick={(event: MouseEvent<HTMLElement>) => setLocationAnchor(event.currentTarget)}
          sx={{ ml: { md: 2 }, maxWidth: { xs: 130, sm: 220 }, overflow: 'hidden' }}
        >
          <Typography noWrap variant="body2" fontWeight={600}>
            {location}
          </Typography>
        </Button>
        <Menu anchorEl={locationAnchor} open={Boolean(locationAnchor)} onClose={() => setLocationAnchor(null)}>
          {LOCATIONS.map((city) => (
            <MenuItem
              key={city}
              selected={city === location}
              onClick={() => {
                dispatch(setDeliveryLocation(city));
                setLocationAnchor(null);
                notify(`Delivery location set to ${city}`, 'info');
              }}
            >
              {city}
            </MenuItem>
          ))}
        </Menu>

        {/* Search bar next to the logo: desktop only */}
        <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' }, mx: 2 }}>{searchBar}</Box>
        <Box sx={{ flex: 1, display: { xs: 'block', md: 'none' } }} />

        {/* Desktop navigation links */}
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Button color="inherit" onClick={() => go('/')}>
            Home
          </Button>
          <Button color="inherit" onClick={() => go('/restaurants')}>
            Restaurants
          </Button>
        </Box>

        {/* Cart icon with item count */}
        <IconButton color="inherit" onClick={() => go('/cart')} aria-label="open cart">
          <Badge badgeContent={cartCount} color="primary" showZero={false}>
            <ShoppingCartIcon />
          </Badge>
        </IconButton>

        {/* Profile icon */}
        <IconButton color="inherit" onClick={(event: MouseEvent<HTMLElement>) => setProfileAnchor(event.currentTarget)} aria-label="profile">
          <AccountCircleIcon />
        </IconButton>
        <Menu anchorEl={profileAnchor} open={Boolean(profileAnchor)} onClose={() => setProfileAnchor(null)}>
          <Box sx={{ px: 2, py: 1 }}>
            <Typography fontWeight={600}>{user?.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={() => go('/orders')}>My Orders</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>

      {/* Search bar on its own row: phones and tablets */}
      <Box sx={{ display: { xs: 'block', md: 'none' }, px: 2, pb: 1.5 }}>{searchBar}</Box>

      {/* Mobile navigation drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 260 }} role="presentation">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
            <Logo />
            <IconButton onClick={() => setDrawerOpen(false)} aria-label="close menu">
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />
          <List>
            {menuLinks.map((link) => (
              <ListItemButton key={link.path} onClick={() => go(link.path)}>
                <ListItemIcon>{link.icon}</ListItemIcon>
                <ListItemText primary={link.label} />
              </ListItemButton>
            ))}
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}
