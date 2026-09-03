/**
 * Base URL for the FastAPI backend, read from the environment.
 *
 * • Client-side (browser) requests use NEXT_PUBLIC_API_URL.
 * • Server-side requests (Server Components, Route Handlers, middleware)
 *   can also read the non-public API_URL if you need a different internal
 *   address (e.g. Docker service name that isn't reachable from the browser).
 *
 * Falls back to "" so relative paths work during local development
 * when the frontend is proxied to the backend.
 */
export const API_URL: string =
  process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL ?? "";
