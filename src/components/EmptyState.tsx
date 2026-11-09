import { Box, Button, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

// Used for "no results", "cart is empty" and "something went wrong" screens.
export default function EmptyState({ icon, title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <Box sx={{ textAlign: 'center', py: 8, px: 2 }}>
      {icon && <Box sx={{ fontSize: 64, color: 'text.disabled', mb: 1 }}>{icon}</Box>}
      <Typography variant="h6" fontWeight={600} gutterBottom>
        {title}
      </Typography>
      {message && (
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {message}
        </Typography>
      )}
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
