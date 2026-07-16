// Keep in sync with `basePath` in next.config.js. Client-side fetch() calls
// aren't auto-prefixed by Next.js the way next/link and the router are, so
// API calls need this prefix added explicitly.
export const BASE_PATH = "/assistant";
