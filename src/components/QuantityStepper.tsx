import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Box, IconButton, Typography } from '@mui/material';

interface QuantityStepperProps {
  value: number;
  onIncrease: () => void;
  onDecrease: () => void;
  max?: number;
  min?: number;
}

// The  [ - 2 + ]  control.
export default function QuantityStepper({ value, onIncrease, onDecrease, max = 10, min = 0 }: QuantityStepperProps) {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        border: '1px solid',
        borderColor: 'primary.main',
        borderRadius: 2,
      }}
    >
      <IconButton size="small" color="primary" onClick={onDecrease} disabled={value <= min} aria-label="Decrease quantity">
        <RemoveIcon fontSize="small" />
      </IconButton>
      <Typography sx={{ minWidth: 28, textAlign: 'center', fontWeight: 600 }}>{value}</Typography>
      <IconButton size="small" color="primary" onClick={onIncrease} disabled={value >= max} aria-label="Increase quantity">
        <AddIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}
