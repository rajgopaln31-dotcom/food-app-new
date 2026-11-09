import { CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './App.css';
import { NotifierProvider } from './components/Notifier';
import './index.css';
import { store } from './store';
import theme from './theme';

// The "providers" wrap the whole app so every component can use Redux, the router,
// the MUI theme and the snackbar notifications.
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <NotifierProvider>
            <App />
          </NotifierProvider>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
