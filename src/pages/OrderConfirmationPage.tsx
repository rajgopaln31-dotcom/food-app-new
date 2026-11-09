import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { Alert, Box, Button, Chip, Divider, Grid, Paper, Step, StepLabel, Stepper, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import PriceSummary from '../components/PriceSummary';
import { useAppSelector } from '../store/hooks';
import { selectOrderById } from '../store/orderSlice';
import { formatPrice } from '../utils/helpers';
import { ORDER_STATUSES, STEP_SECONDS, getStatusIndex } from '../utils/orderStatus';

const PAYMENT_LABELS = {
  upi: 'UPI',
  card: 'Credit / Debit card',
  netbanking: 'Net banking',
  cod: 'Cash on delivery',
} as const;

const formatTime = (timestamp: number, withSeconds = false): string =>
  new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: withSeconds ? '2-digit' : undefined,
  });

// Screen 8: Order confirmation and tracking
export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const order = useAppSelector(selectOrderById(orderId));
  const timelineRef = useRef<HTMLDivElement>(null);

  // "now" changes every second so the timeline moves forward by itself (simulated tracking).
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Only the owner of the order can open it.
  if (!order || order.userId !== user?.id) {
    return (
      <EmptyState
        icon={<ReceiptLongIcon fontSize="inherit" />}
        title="Order not found"
        message="We could not find this order."
        actionLabel="View my orders"
        onAction={() => navigate('/orders')}
      />
    );
  }

  const statusIndex = getStatusIndex(order.createdAt, now);
  const isDelivered = statusIndex === ORDER_STATUSES.length - 1;
  const { address } = order;

  return (
    <Box>
      {/* Success header */}
      <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', mb: 3 }}>
        <CheckCircleIcon color="success" sx={{ fontSize: 72 }} />
        <Typography variant="h5" fontWeight={700}>
          Order placed successfully!
        </Typography>
        <Typography color="text.secondary">Thank you for ordering from {order.restaurantName}.</Typography>
        <Chip label={`Order ID: ${order.id}`} color="primary" sx={{ mt: 1.5, fontWeight: 700 }} />
        <Typography sx={{ mt: 1 }}>
          {isDelivered ? 'Your order has been delivered. Enjoy your meal!' : `Estimated delivery by ${formatTime(order.createdAt + order.estimatedMinutes * 60000)}`}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap', mt: 2 }}>
          <Button variant="contained" onClick={() => timelineRef.current?.scrollIntoView({ behavior: 'smooth' })}>
            Track order
          </Button>
          <Button variant="outlined" onClick={() => navigate('/')}>
            Continue shopping
          </Button>
          <Button variant="outlined" onClick={() => navigate('/orders')}>
            View my orders
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Left: order summary */}
        <Grid item xs={12} md={7}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight={700}>
              Order summary
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {order.restaurantName}
            </Typography>
            {order.items.map((item) => (
              <Box key={item.cartId} sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, py: 0.5 }}>
                <Box>
                  <Typography variant="body2">
                    {item.quantity} x {item.name}
                  </Typography>
                  {(item.sizeName || item.addOnNames.length > 0) && (
                    <Typography variant="caption" color="text.secondary">
                      {[item.sizeName, ...item.addOnNames].filter(Boolean).join(', ')}
                    </Typography>
                  )}
                </Box>
                <Typography variant="body2">{formatPrice(item.unitPrice * item.quantity)}</Typography>
              </Box>
            ))}
            <Divider sx={{ my: 1.5 }} />
            <PriceSummary price={order.price} title="Bill details" />
            <Divider sx={{ my: 1.5 }} />
            <Typography variant="body2">
              <b>Payment:</b> {PAYMENT_LABELS[order.paymentMethod]} ({order.paymentStatus})
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <b>Delivery address:</b> {address.fullName}, {address.houseNumber}, {address.street}
              {address.landmark ? `, near ${address.landmark}` : ''}, {address.city}, {address.state} - {address.pincode}. Mobile: {address.mobile}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <b>Total amount:</b> {formatPrice(order.price.total)}
            </Typography>
          </Paper>
        </Grid>

        {/* Right: status timeline */}
        <Grid item xs={12} md={5}>
          <Paper variant="outlined" sx={{ p: 2 }} ref={timelineRef}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              Order status
            </Typography>
            <Stepper activeStep={isDelivered ? ORDER_STATUSES.length : statusIndex} orientation="vertical">
              {ORDER_STATUSES.map((label, index) => (
                <Step key={label}>
                  <StepLabel
                    optional={
                      index <= statusIndex ? (
                        <Typography variant="caption">{formatTime(order.createdAt + index * STEP_SECONDS * 1000, true)}</Typography>
                      ) : undefined
                    }
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            <Alert severity="info" variant="outlined" sx={{ mt: 2 }}>
              Demo: tracking is simulated. The status moves forward every {STEP_SECONDS} seconds because there is no real backend.
            </Alert>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
