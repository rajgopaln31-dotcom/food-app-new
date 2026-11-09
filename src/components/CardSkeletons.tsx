import { Box, Grid, Skeleton } from '@mui/material';

// Grey "loading" placeholders shown while data is being fetched.
export function RestaurantCardSkeleton() {
  return (
    <Box>
      <Skeleton variant="rounded" height={160} />
      <Skeleton width="70%" sx={{ mt: 1 }} />
      <Skeleton width="45%" />
    </Box>
  );
}

export function RestaurantGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <Grid container spacing={2}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <RestaurantCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
}
