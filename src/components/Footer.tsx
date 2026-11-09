import { Box, Container, Link as MuiLink, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: 'secondary.main', color: '#fff', mt: 4, py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 3 }}>
          <Box sx={{ maxWidth: 320 }}>
            <Logo light />
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
              Hot and fresh food from your favourite restaurants, delivered to your door.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography fontWeight={600}>Quick links</Typography>
            <MuiLink component={Link} to="/" color="inherit" underline="hover">
              Home
            </MuiLink>
            <MuiLink component={Link} to="/restaurants" color="inherit" underline="hover">
              Restaurants
            </MuiLink>
            <MuiLink component={Link} to="/orders" color="inherit" underline="hover">
              My Orders
            </MuiLink>
          </Box>
        </Box>
        <Typography variant="caption" sx={{ display: 'block', mt: 3, opacity: 0.6 }}>
          © {new Date().getFullYear()} FoodieGo. Student project - demo data only.
        </Typography>
      </Container>
    </Box>
  );
}
