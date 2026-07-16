// Keep in sync with `basePath` in next.config.js (currently unset, so the
// app is served from the domain root). If you later deploy this under a
// sub-path like yourdomain.com/assistant, set basePath there and mirror the
// same value here — client-side fetch() calls aren't auto-prefixed by
// Next.js the way next/link and the router are.
export const BASE_PATH = "";
