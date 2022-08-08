export { default } from "next-auth/middleware"

export const config = { matcher: ["/accounts/:path*", "/fleets/:path*", "/marketplace/:path*", "/reports/:path*", "/trips/:path*", "/settings/:path*"] }
