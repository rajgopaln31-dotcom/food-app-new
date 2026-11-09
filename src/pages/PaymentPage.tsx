import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PaymentsIcon from '@mui/icons-material/Payments';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifier } from '../components/Notifier';
import PriceSummary from '../components/PriceSummary';
import { PaymentCancelledError, processPayment } from '../services/paymentService';
import { selectSelectedAddress } from '../store/addressSlice';
import { clearCart, selectCartItems, selectCartRestaurantId, selectCartRestaurantName, selectPriceBreakdown } from '../store/cartSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { placeOrder } from '../store/orderSlice';
import type { PaymentMethod } from '../types';
import { formatPrice, getErrorMessage } from '../utils/helpers';
import { validateCardNumber, validateCvv, validateExpiry, validateRequired, validateUpi } from '../utils/validators';

const BANKS = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank'];

const METHODS: { value: PaymentMethod; label: string; icon: ReactNode }[] = [
  { value: 'upi', label: 'UPI', icon: <QrCode2Icon /> },
  { value: 'card', label: 'Credit / Debit card', icon: <CreditCardIcon /> },
  { value: 'netbanking', label: 'Net banking', icon: <AccountBalanceIcon /> },
  { value: 'cod', label: 'Cash on delivery', icon: <PaymentsIcon /> },
];

type Step = 'idle' | 'paying' | 'creating';
type Errors = Record<string, string>;

// Screen 7: Payment
export default function PaymentPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { notify } = useNotifier();

  const user = useAppSelector((state) => state.auth.user);
  const items = useAppSelector(selectCartItems);
  const restaurantId = useAppSelector(selectCartRestaurantId);
  const restaurantName = useAppSelector(selectCartRestaurantName);
  const price = useAppSelector(selectPriceBreakdown);
  const address = useAppSelector(selectSelectedAddress);

  const [method, setMethod] = useState<PaymentMethod>('upi');
  const [upiId, setUpiId] = useState('');
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [bank, setBank] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [step, setStep] = useState<Step>('idle');
  const [failureMessage, setFailureMessage] = useState('');

  // Refs keep their value without re-rendering the page.
  const isSubmitting = useRef(false); // stops double clicks (duplicate payments)
  const orderDone = useRef(false); // true after the order is created
  const abortController = useRef<AbortController | null>(null);

  // No cart or no address? Go back (but not after the order was placed).
  useEffect(() => {
    if (orderDone.current) return;
    if (items.length === 0) navigate('/cart', { replace: true });
    else if (!address) navigate('/checkout', { replace: true });
  }, [items.length, address, navigate]);

  const handleCardChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name } = event.target;
    let { value } = event.target;
    if (name === 'number') {
      const digits = value.replace(/\D/g, '').slice(0, 16);
      value = digits.replace(/(.{4})/g, '$1 ').trim(); // 1234 5678 ...
    }
    if (name === 'expiry') {
      const digits = value.replace(/\D/g, '').slice(0, 4);
      value = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
    }
    if (name === 'cvv') value = value.replace(/\D/g, '').slice(0, 3);
    setCard({ ...card, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  // Validate only the fields of the chosen payment method.
  const validate = (): boolean => {
    const found: Errors = {};
    if (method === 'upi') found.upiId = validateUpi(upiId);
    if (method === 'card') {
      found.number = validateCardNumber(card.number);
      found.name = validateRequired(card.name, 'Name on card');
      found.expiry = validateExpiry(card.expiry);
      found.cvv = validateCvv(card.cvv);
    }
    if (method === 'netbanking') found.bank = bank === '' ? 'Please select your bank' : '';
    setErrors(found);
    return Object.values(found).every((message) => message === '');
  };

  const handlePay = async () => {
    if (isSubmitting.current) return; // already working on it
    if (!validate() || !user || !address || !restaurantId || !restaurantName) return;

    isSubmitting.current = true;
    setFailureMessage('');
    const controller = new AbortController();
    abortController.current = controller;

    try {
      // 1) Take the payment (not needed for cash on delivery)
      if (method !== 'cod') {
        setStep('paying');
        await processPayment({ method, amount: price.total, upiId, cardNumber: card.number }, controller.signal);
      }

      // 2) Create the order. We only show success AFTER this finishes.
      setStep('creating');
      const order = await dispatch(
        placeOrder({
          userId: user.id,
          restaurantId,
          restaurantName,
          items,
          address,
          price,
          paymentMethod: method,
          paymentStatus: method === 'cod' ? 'Pay on Delivery' : 'Paid',
        }),
      ).unwrap();

      orderDone.current = true;
      navigate(`/order-confirmation/${order.id}`, { replace: true });
      dispatch(clearCart());
      notify('Order placed successfully!', 'success');
    } catch (error) {
      if (error instanceof PaymentCancelledError) {
        notify('Payment cancelled. You have not been charged.', 'warning');
      } else {
        const message = getErrorMessage(error);
        setFailureMessage(message);
        notify(message, 'error');
      }
    } finally {
      isSubmitting.current = false;
      setStep('idle');
    }
  };

  if (items.length === 0 || !address) return null;

  const methodFields = () => {
    if (method === 'upi') {
      return (
        <TextField
          label="UPI ID"
          placeholder="yourname@upi"
          value={upiId}
          onChange={(event) => {
            setUpiId(event.target.value);
            setErrors({ ...errors, upiId: '' });
          }}
          error={Boolean(errors.upiId)}
          helperText={errors.upiId}
          fullWidth
        />
      );
    }
    if (method === 'card') {
      return (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="number"
              label="Card number"
              placeholder="1234 5678 9012 3456"
              value={card.number}
              onChange={handleCardChange}
              error={Boolean(errors.number)}
              helperText={errors.number}
              inputProps={{ inputMode: 'numeric' }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="name"
              label="Name on card"
              value={card.name}
              onChange={handleCardChange}
              error={Boolean(errors.name)}
              helperText={errors.name}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="expiry"
              label="Expiry (MM/YY)"
              value={card.expiry}
              onChange={handleCardChange}
              error={Boolean(errors.expiry)}
              helperText={errors.expiry}
              inputProps={{ inputMode: 'numeric' }}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="cvv"
              label="CVV"
              type="password"
              value={card.cvv}
              onChange={handleCardChange}
              error={Boolean(errors.cvv)}
              helperText={errors.cvv}
              inputProps={{ inputMode: 'numeric' }}
              fullWidth
            />
          </Grid>
        </Grid>
      );
    }
    if (method === 'netbanking') {
      return (
        <TextField
          select
          label="Select your bank"
          value={bank}
          onChange={(event) => {
            setBank(event.target.value);
            setErrors({ ...errors, bank: '' });
          }}
          error={Boolean(errors.bank)}
          helperText={errors.bank}
          fullWidth
        >
          {BANKS.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </TextField>
      );
    }
    return <Alert severity="info">Pay {formatPrice(price.total)} in cash when your food arrives.</Alert>;
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Payment
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography fontWeight={700}>Choose payment method</Typography>
            <RadioGroup
              value={method}
              onChange={(event) => {
                setMethod(event.target.value as PaymentMethod);
                setErrors({});
                setFailureMessage('');
              }}
            >
              {METHODS.map((item) => (
                <Paper
                  key={item.value}
                  variant="outlined"
                  sx={{ px: 1.5, my: 0.75, borderColor: method === item.value ? 'primary.main' : 'divider' }}
                >
                  <FormControlLabel
                    value={item.value}
                    control={<Radio />}
                    sx={{ width: '100%', m: 0 }}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.75 }}>
                        {item.icon}
                        <Typography>{item.label}</Typography>
                      </Box>
                    }
                  />
                </Paper>
              ))}
            </RadioGroup>

            <Box sx={{ mt: 2 }}>{methodFields()}</Box>

            {failureMessage && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {failureMessage}
              </Alert>
            )}

            <Alert severity="info" variant="outlined" sx={{ mt: 2 }}>
              Demo payment gateway: no real money is used. To test a failed payment, use a card ending in 0000 or a UPI ID
              starting with &quot;fail&quot;.
            </Alert>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight={700}>
              Order summary
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {items.length} dish{items.length === 1 ? '' : 'es'} from {restaurantName}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Deliver to: {address.houseNumber}, {address.street}, {address.city} - {address.pincode}
            </Typography>
            <PriceSummary price={price} title="Amount to pay" />
            <Button fullWidth variant="contained" size="large" sx={{ mt: 2 }} onClick={handlePay} disabled={step !== 'idle'}>
              {method === 'cod' ? 'Place order' : `Pay now - ${formatPrice(price.total)}`}
            </Button>
            <Button fullWidth color="inherit" sx={{ mt: 1 }} onClick={() => navigate('/checkout')} disabled={step !== 'idle'}>
              Back to address
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Loading popup while the payment / order is processed */}
      <Dialog open={step !== 'idle'} disableEscapeKeyDown>
        <DialogContent sx={{ textAlign: 'center', px: 5, pt: 4 }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }} fontWeight={600}>
            {step === 'paying' ? 'Processing your payment...' : method === 'cod' ? 'Placing your order...' : 'Payment received. Creating your order...'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please do not close or refresh this page.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          {step === 'paying' && (
            <Button color="inherit" onClick={() => abortController.current?.abort()}>
              Cancel payment
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
