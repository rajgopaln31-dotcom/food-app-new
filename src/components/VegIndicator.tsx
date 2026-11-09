import { Box } from '@mui/material';

// The small green (veg) or red (non-veg) square used on Indian food apps.
export default function VegIndicator({ isVeg }: { isVeg: boolean }) {
  const color = isVeg ? '#2e9b4f' : '#d32f2f';
  return (
    <Box
      title={isVeg ? 'Vegetarian' : 'Non-vegetarian'}
      sx={{
        width: 16,
        height: 16,
        border: `2px solid ${color}`,
        borderRadius: '3px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color }} />
    </Box>
  );
}
