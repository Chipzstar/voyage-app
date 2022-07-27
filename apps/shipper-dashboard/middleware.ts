/*export { default } from "next-auth/middleware";

export const config = { matcher: ['/', '/location', '/shipments/:path*', '/bookings/:path*', '/workflows/:path*', '/billing/:path*'] }*/

import withAuth from "next-auth/middleware"

export default withAuth({
	callbacks: {
		authorized: ({ token }) => {
			console.log("AUTHORIZED", !!token)
			return !!token
		},
	},
})

export const config = { matcher: ['/', '/location', '/shipments/:path*', '/bookings/:path*', '/workflows/:path*', '/billing/:path*'] }

