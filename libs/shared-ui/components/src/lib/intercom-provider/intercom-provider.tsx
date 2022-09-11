import styles from './intercom-provider.module.css';
import { useEffect } from "react";
import { useRouter } from "next/router";
import { loadIntercom, updateIntercom } from 'next-intercom';
import { DefaultSession } from 'next-auth';

interface Session extends DefaultSession {
	id: string;
}

export interface IntercomProviderProps {
	appId: string;
	session?: Session,
	children: JSX.Element
}

export const IntercomProvider = ({ appId, session, children }:IntercomProviderProps) => {
	const router = useRouter();

	if (typeof window !== "undefined") {
		loadIntercom({
			appId, // default : ''
			name: session?.user?.name,
			email: session?.user?.email,
			user_id: session?.id,
			ssr: false, // default: false
			initWindow: true, // default: true
			delay: 0, // default: 0  - useful for mobile devices to prevent blocking the main thread
		});
	}

	useEffect(() => {
		const handleRouteChange = (url: string) => {
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
