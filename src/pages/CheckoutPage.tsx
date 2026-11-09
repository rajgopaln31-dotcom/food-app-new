import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { Alert, Box, Button, Card, Chip, Divider, Grid, Paper, Radio, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddressFormDialog from '../components/AddressFormDialog';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import { useNotifier } from '../components/Notifier';
import PriceSummary from '../components/PriceSummary';
import {
  addAddress,
  deleteAddress,
  selectAddress,
  selectAddresses,
  selectSelectedAddress,
  setDefaultAddress,
  updateAddress,
} from '../store/addressSlice';
import { selectCartItems, selectCartRestaurantName, selectPriceBreakdown } from '../store/cartSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import type { Address, AddressFormValues } from '../types';
import { formatPrice, generateId } from '../utils/helpers';
import { validateMobile, validatePincode } from '../utils/validators';

// Screen 6: Delivery address / checkout
export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { notify } = useNotifier();

  const items = useAppSelector(selectCartItems);
  const restaurantName = useAppSelector(selectCartRestaurantName);
  const price = useAppSelector(selectPriceBreakdown);
  const addresses = useAppSelector(selectAddresses);
  const selectedAddress = useAppSelector(selectSelectedAddress);

  const [formOpen, setFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | undefined>(undefined);
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);
  const [addressError, setAddressError] = useState('');

  const openAddForm = () => {
    setEditingAddress(undefined);
    setFormOpen(true);
  };

  const openEditForm = (address: Address) => {
    setEditingAddress(address);
    setFormOpen(true);
  };

  const handleSave = (values: AddressFormValues) => {
    if (editingAddress) {
      dispatch(updateAddress({ ...values, id: editingAddress.id }));
      notify('Address updated', 'success');
    } else {
      dispatch(addAddress({ ...values, id: generateId() }));
      notify('Address added', 'success');
    }
    setAddressError('');
    setFormOpen(false);
  };

  const handleDelete = () => {
    if (!addressToDelete) return;
    dispatch(deleteAddress(addressToDelete.id));
    notify('Address deleted', 'info');
    setAddressToDelete(null);
  };

  // Check the address again before moving on to payment.
  const handleProceed = () => {
    if (!selectedAddress) {
      setAddressError('Please select or add a delivery address');
      return;
    }
    if (validateMobile(selectedAddress.mobile) || validatePincode(selectedAddress.pincode)) {
      setAddressError('The selected address has an invalid mobile number or PIN code. Please edit it.');
      return;
    }
    navigate('/payment');
  };

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<RemoveShoppingCartIcon fontSize="inherit" />}
        title="Your cart is empty"
        message="Add items to your cart before checkout."
        actionLabel="Browse restaurants"
        onAction={() => navigate('/restaurants')}
      />
    );
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Delivery address
      </Typography>
      <Grid container spacing={3}>
        {/* Left: address list */}
        <Grid item xs={12} md={7}>
          {addressError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {addressError}
            </Alert>
          )}

          {addresses.length === 0 && (
            <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', mb: 2 }}>
              <Typography color="text.secondary">You have no saved addresses yet.</Typography>
            </Paper>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {addresses.map((address) => {
              const isSelected = selectedAddress?.id === address.id;
              return (
                <Card
                  key={address.id}
                  variant="outlined"
                  sx={{ p: 2, borderColor: isSelected ? 'primary.main' : 'divider', borderWidth: isSelected ? 2 : 1 }}
                >
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Radio
                      checked={isSelected}
                      onChange={() => {
                        dispatch(selectAddress(address.id));
                        setAddressError('');
                      }}
                      inputProps={{ 'aria-label': `select address of ${address.fullName}` }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Typography fontWeight={700}>{address.fullName}</Typography>
                        {address.isDefault && <Chip label="Default" size="small" color="primary" />}
                      </Box>
                      <Typography variant="body2">
                        {address.houseNumber}, {address.street}
                        {address.landmark ? `, near ${address.landmark}` : ''}
                      </Typography>
                      <Typography variant="body2">
                        {address.city}, {address.state} - {address.pincode}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Mobile: {address.mobile}
                      </Typography>
                      {address.instructions && (
                        <Typography variant="body2" color="text.secondary">
                          Instructions: {address.instructions}
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                        <Button size="small" onClick={() => openEditForm(address)}>
                          Edit
                        </Button>
                        <Button size="small" color="error" onClick={() => setAddressToDelete(address)}>
                          Delete
                        </Button>
                        {!address.isDefault && (
                          <Button
                            size="small"
                            color="inherit"
                            onClick={() => {
                              dispatch(setDefaultAddress(address.id));
                              notify('Default address changed', 'success');
                            }}
                          >
                            Set as default
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Card>
              );
            })}
          </Box>

          <Button startIcon={<AddLocationAltIcon />} variant="outlined" sx={{ mt: 2 }} onClick={openAddForm}>
            Add new address
          </Button>
        </Grid>

        {/* Right: order summary */}
        <Grid item xs={12} md={5}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight={700}>
              Order summary
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              From {restaurantName}
            </Typography>
            {items.map((item) => (
              <Box key={item.cartId} sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, py: 0.5 }}>
                <Typography variant="body2">
                  {item.quantity} x {item.name}
                </Typography>
                <Typography variant="body2">{formatPrice(item.unitPrice * item.quantity)}</Typography>
              </Box>
            ))}
            <Divider sx={{ my: 1.5 }} />
            <PriceSummary price={price} title="Bill details" />
            <Button fullWidth variant="contained" size="large" sx={{ mt: 2 }} onClick={handleProceed}>
              Proceed to payment
            </Button>
            <Button fullWidth color="inherit" sx={{ mt: 1 }} onClick={() => navigate('/cart')}>
              Back to cart
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <AddressFormDialog open={formOpen} address={editingAddress} onClose={() => setFormOpen(false)} onSave={handleSave} />

      <ConfirmDialog
        open={addressToDelete !== null}
        title="Delete address?"
        message={`Do you want to delete the address of ${addressToDelete?.fullName ?? ''}?`}
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setAddressToDelete(null)}
      />
    </Box>
  );
}
