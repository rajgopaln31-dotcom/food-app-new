import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { Box, Button, Card, Chip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import { useAppSelector } from '../store/hooks';
import { selectOrders } from '../store/orderSlice';
import { formatPrice } from '../utils/helpers';
import { ORDER_STATUSES, getStatusIndex } from '../utils/orderStatus';

// Order history of the logged in user.
export default function MyOrdersPage() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const allOrders = useAppSelector(selectOrders);
  const orders = allOrders.filter((order) => order.userId === user?.id);

  // Refresh every few seconds so the status chips update.
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 3000);
    return () => clearInterval(timer);
  }, []);

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={<ReceiptLongIcon fontSize="inherit" />}
        title="No orders yet"
        message="When you place an order, it will appear here."
        actionLabel="Order food"
        onAction={() => navigate('/restaurants')}
      />
    );
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        My orders
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {orders.map((order) => {
          const statusIndex = getStatusIndex(order.createdAt, now);
          const delivered = statusIndex === ORDER_STATUSES.length - 1;
          return (
            <Card key={order.id} variant="outlined" sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Box>
                  <Typography fontWeight={700}>{order.restaurantName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Order {order.id} | {new Date(order.createdAt).toLocaleString()}
                  </Typography>
                </Box>
                <Chip label={ORDER_STATUSES[statusIndex]} color={delivered ? 'success' : 'primary'} />
              </Box>
              <Typography variant="body2" sx={{ my: 1 }}>
                {order.items.map((item) => `${item.quantity} x ${item.name}`).join(', ')}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography fontWeight={700}>{formatPrice(order.price.total)}</Typography>
                <Button size="small" variant="outlined" onClick={() => navigate(`/order-confirmation/${order.id}`)}>
                  {delivered ? 'View details' : 'Track order'}
                </Button>
              </Box>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}
