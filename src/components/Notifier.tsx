import { Alert, Snackbar } from '@mui/material';
import type { AlertColor } from '@mui/material';
import { createContext, useCallback, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// A tiny "context" so ANY component can show a snackbar message:
//   const { notify } = useNotifier();
//   notify('Saved!', 'success');

interface NotifierContextValue {
  notify: (message: string, severity?: AlertColor) => void;
}

const NotifierContext = createContext<NotifierContextValue>({ notify: () => undefined });

export function NotifierProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('success');

  const notify = useCallback((text: string, level: AlertColor = 'success') => {
    setMessage(text);
    setSeverity(level);
    setOpen(true);
  }, []);

  return (
    <NotifierContext.Provider value={{ notify }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={3500}
        onClose={(_event, reason) => {
          if (reason !== 'clickaway') setOpen(false);
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setOpen(false)} severity={severity} variant="filled" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </NotifierContext.Provider>
  );
}

export const useNotifier = () => useContext(NotifierContext);
