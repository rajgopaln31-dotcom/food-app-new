import { Box, Container } from '@mui/material';
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { loadRestaurantData, selectRestaurantStatus } from '../store/restaurantSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import Footer from './Footer';
import Header from './Header';

// Header + page content + footer. <Outlet /> is where the current page appears.
export default function MainLayout() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectRestaurantStatus);
  const { pathname } = useLocation();

  // Load restaurants and food once, when the layout first appears.
  useEffect(() => {
    if (status === 'idle') dispatch(loadRestaurantData());
  }, [status, dispatch]);

  // Start every new page at the top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flex: 1 }}>
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <Outlet />
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
