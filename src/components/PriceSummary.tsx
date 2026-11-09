import { Box, Divider, Typography } from '@mui/material';
import type { PriceBreakdown } from '../types';
import { formatPrice } from '../utils/helpers';
import { FREE_DELIVERY_ABOVE } from '../utils/pricing';

interface PriceSummaryProps {
  price: PriceBreakdown;
  title?: string;
}

function Row({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
      <Typography color="text.secondary">{label}</Typography>
      <Typography color={color}>{value}</Typography>
    </Box>
  );
}

// Subtotal, discount, delivery, tax and total. Used on Cart, Checkout, Payment and Order pages.
export default function PriceSummary({ price, title = 'Price details' }: PriceSummaryProps) {
  const amountForFreeDelivery = FREE_DELIVERY_ABOVE - price.subtotal;

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={700} gutterBottom>
        {title}
      </Typography>
      <Row label="Subtotal" value={formatPrice(price.subtotal)} />
      {price.discount > 0 && <Row label="Coupon discount" value={`- ${formatPrice(price.discount)}`} color="success.main" />}
      <Row
        label="Delivery charges"
        value={price.deliveryCharge === 0 ? 'FREE' : formatPrice(price.deliveryCharge)}
        color={price.deliveryCharge === 0 ? 'success.main' : undefined}
      />
      <Row label="Taxes (5% GST)" value={formatPrice(price.tax)} />
      <Divider sx={{ my: 1 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
        <Typography fontWeight={700}>Total payable</Typography>
        <Typography fontWeight={700} color="primary">
          {formatPrice(price.total)}
        </Typography>
      </Box>
      {price.deliveryCharge > 0 && amountForFreeDelivery > 0 && (
        <Typography variant="caption" color="text.secondary">
          Add items worth {formatPrice(amountForFreeDelivery)} more for free delivery
        </Typography>
      )}
    </Box>
  );
}
