/// <reference types="vite/client" />

// Tell TypeScript which environment variables exist.
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
