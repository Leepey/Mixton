/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_BASE_URL: string
  readonly TON_MAINNET_API_KEY: string
  readonly TON_TESTNET_API_KEY: string
  readonly MIXTON_MAINNET_ADDRESS: string
  readonly MIXTON_TESTNET_ADDRESS: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
