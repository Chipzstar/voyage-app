export { default } from "next-auth/middleware";

export const config = { matcher: ['/', '/location', '/shipments/:path*', '/bookings/:path*', '/workflows/:path*', '/billing/:path*'] }