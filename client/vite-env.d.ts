/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER: string;
  // add more env variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
