import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite config: only the React plugin is needed for this project.
export default defineConfig({
  plugins: [react()],
});
