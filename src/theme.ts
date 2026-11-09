import { createTheme } from '@mui/material/styles';

// One place to change colours, fonts and the default look of MUI components.
const theme = createTheme({
  palette: {
    primary: { main: '#fc8019', contrastText: '#ffffff' },
    secondary: { main: '#282c3f' },
    success: { main: '#2e9b4f' },
    background: { default: '#f7f7f9' },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiCard: { defaultProps: { elevation: 0 } },
  },
});

export default theme;
