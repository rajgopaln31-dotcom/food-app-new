import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import type { Address, AddressFormValues } from '../types';
import { validateMobile, validatePincode, validateRequired } from '../utils/validators';

interface AddressFormDialogProps {
  open: boolean;
  address?: Address; // given = edit mode, missing = add mode
  onClose: () => void;
  onSave: (values: AddressFormValues) => void;
}

const emptyForm: AddressFormValues = {
  fullName: '',
  mobile: '',
  houseNumber: '',
  street: '',
  landmark: '',
  city: '',
  state: '',
  pincode: '',
  instructions: '',
  isDefault: false,
};

type FormErrors = Partial<Record<keyof AddressFormValues, string>>;

// Popup form to add or edit a delivery address.
export default function AddressFormDialog({ open, address, onClose, onSave }: AddressFormDialogProps) {
  const [values, setValues] = useState<AddressFormValues>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});

  // Every time the dialog opens, fill the form (edit) or empty it (add).
  useEffect(() => {
    if (open) {
      setValues(address ? { ...address } : emptyForm);
      setErrors({});
    }
  }, [open, address]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name } = event.target;
    let { value } = event.target;
    // Mobile and PIN code accept digits only.
    if (name === 'mobile') value = value.replace(/\D/g, '').slice(0, 10);
    if (name === 'pincode') value = value.replace(/\D/g, '').slice(0, 6);
    setValues({ ...values, [name]: value });
    if (errors[name as keyof AddressFormValues]) setErrors({ ...errors, [name]: '' });
  };

  const validate = (): FormErrors => ({
    fullName: validateRequired(values.fullName, 'Full name'),
    mobile: validateMobile(values.mobile),
    houseNumber: validateRequired(values.houseNumber, 'House number'),
    street: validateRequired(values.street, 'Street'),
    city: validateRequired(values.city, 'City'),
    state: validateRequired(values.state, 'State'),
    pincode: validatePincode(values.pincode),
  });

  const handleSubmit = () => {
    const newErrors = validate();
    setErrors(newErrors);
    const hasError = Object.values(newErrors).some((message) => message !== '');
    if (hasError) return;
    onSave({ ...values, fullName: values.fullName.trim() });
  };

  // Small helper so each field is only one line below.
  const field = (name: keyof AddressFormValues, label: string, extra: object = {}) => (
    <TextField
      name={name}
      label={label}
      value={values[name] as string}
      onChange={handleChange}
      error={Boolean(errors[name])}
      helperText={errors[name]}
      fullWidth
      {...extra}
    />
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{address ? 'Edit address' : 'Add new address'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0 }}>
          <Grid item xs={12} sm={6}>
            {field('fullName', 'Full name')}
          </Grid>
          <Grid item xs={12} sm={6}>
            {field('mobile', 'Mobile number', { inputProps: { inputMode: 'numeric', maxLength: 10 } })}
          </Grid>
          <Grid item xs={12} sm={4}>
            {field('houseNumber', 'House / Flat no.')}
          </Grid>
          <Grid item xs={12} sm={8}>
            {field('street', 'Street / Area')}
          </Grid>
          <Grid item xs={12}>
            {field('landmark', 'Landmark (optional)')}
          </Grid>
          <Grid item xs={12} sm={4}>
            {field('city', 'City')}
          </Grid>
          <Grid item xs={12} sm={4}>
            {field('state', 'State')}
          </Grid>
          <Grid item xs={12} sm={4}>
            {field('pincode', 'PIN code', { inputProps: { inputMode: 'numeric', maxLength: 6 } })}
          </Grid>
          <Grid item xs={12}>
            {field('instructions', 'Delivery instructions (optional)', { multiline: true, rows: 2 })}
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={values.isDefault}
                  onChange={(event) => setValues({ ...values, isDefault: event.target.checked })}
                />
              }
              label="Make this my default address"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button color="inherit" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Save address
        </Button>
      </DialogActions>
    </Dialog>
  );
}
