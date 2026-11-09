import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

// Website logo (image + name). Clicking it goes to Home.
export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none' }}>
      <Box component="img" src="/images/logo.svg" alt="FoodieGo logo" sx={{ width: 36, height: 36 }} />
      <Typography variant="h6" fontWeight={700} color={light ? '#fff' : 'primary'}>
        FoodieGo
      </Typography>
    </Box>
  );
}
