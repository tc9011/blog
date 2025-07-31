/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />
interface ImportMetaEnv {
  readonly PUBLIC_DOC_SEARCH_APP_ID: string
  readonly PUBLIC_DOC_SEARCH_API_KEY: string
  readonly PUBLIC_DOC_SEARCH_INDEX_NAME: string
  readonly PUBLIC_GOOGLE_SITE_VERIFICATION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
