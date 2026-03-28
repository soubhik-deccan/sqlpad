/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL_OVERRIDE?: string;
  readonly VITE_SPA_BASE_URL_OVERRIDE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
