import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { initIntercomWindow, loadIntercom, updateIntercom } from 'next-intercom';
import { intercomPlatform } from '@voyage-app/shared-utils';

export const IntercomProvider = ({ session, children }) => {
	const router = useRouter();

	if (typeof window !== 'undefined') {
		loadIntercom({
			appId: process.env.NEXT_PUBLIC_INTERCOM_APP_ID, // default : ''
			name: session?.user.name,
			email: session?.user.email,
			user_id: session?.id,
			Platform: intercomPlatform.SHIPPER,
			ssr: false, // default: false
			initWindow: true, // default: true
			delay: 0 // default: 0  - useful for mobile devices to prevent blocking the main thread
		});
		/*bootIntercom({
			api_base: "https://api-iam.intercom.io",
			user_id: session?.id,
			name: session?.user.name,
			email: session?.user.email,
		});*/
	} else {
		loadIntercom({
			appId: process.env.NEXT_PUBLIC_INTERCOM_APP_ID, // default : ''
			name: session?.user.name,
			email: session?.user.email,
			user_id: session?.id,
			ssr: true, // default: false
			initWindow: false, // default: true
			delay: 0 // default: 0  - useful for mobile devices to prevent blocking the main thread
		});
		initIntercomWindow({
			appId: process.env.NEXT_PUBLIC_INTERCOM_APP_ID,
			name: session?.user.name,
			email: session?.user.email,
			user_id: session?.id
		});
	}

	useEffect(() => {
		const handleRouteChange = url => {
			if (typeof window !== 'undefined') {
				updateIntercom();
			}
		};

		router.events.on('routeChangeStart', handleRouteChange);

		// If the component is unmounted, unsubscribe
		// from the event with the `off` method:
		return () => router.events.off('routeChangeStart', handleRouteChange);
	}, [router.events]);

	return children;
};
