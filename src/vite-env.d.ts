/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_TIMEOUT: string
  readonly VITE_FETCH_INTERVAL: string
  readonly VITE_RETENTION_DAYS: string
  readonly VITE_DEBUG: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
