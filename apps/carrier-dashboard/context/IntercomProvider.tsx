import { useEffect } from "react";
import { useRouter } from "next/router";
import {
	load as loadIntercom,
	boot as bootIntercom,
	update as updateIntercom,
} from "../utils/intercom";

export const IntercomProvider = ({ session, children }) => {
	const router = useRouter();

	if (typeof window !== "undefined") {
		loadIntercom();
		bootIntercom({
			api_base: "https://api-iam.eu.intercom.io",
			user_id: session?.id,
			name: session?.user.name,
			email: session?.user.email,
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