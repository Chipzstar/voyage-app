import React, { useEffect, useMemo } from 'react';
import Sidebar from './Sidebar';
import { useRouter } from 'next/router';
import { PUBLIC_PATHS } from '../utils/constants';
import { ChatWidget } from '@papercups-io/chat-widget';
import { useSelector } from 'react-redux';
import { useCarrier } from '../store/feature/profileSlice';

const Layout = ({ session, children }) => {
	const router = useRouter();
	const profile = useSelector(useCarrier);
	const isAuthScreen = useMemo(() => ![PUBLIC_PATHS.LOGIN, PUBLIC_PATHS.SIGNUP].includes(router.pathname), [router.pathname]);

	const currentURL = useMemo(() => {
		return typeof window === 'undefined' ? `${process.env.NEXTAUTH_URL}${router.pathname}` : `${window.location.origin}${router.pathname}`;
	}, [router]);

	return (
		<div className='relative flex min-h-screen'>
			{isAuthScreen && (
				<aside className='relative sticky top-0 h-screen' aria-label='Sidebar'>
					<Sidebar />
				</aside>
			)}
			<main className='min-h-screen grow overflow-hidden'>
				{children}
				{isAuthScreen && (
					<ChatWidget
						// `accountId` is used instead of `token` in older versions
						// of the @papercups-io/chat-widget package (before v1.2.x).
						// You can delete this line if you are on the latest version.
						// accountId="8d14f8d9-7027-4af7-8fb2-14ca0712e633"
						token='8d14f8d9-7027-4af7-8fb2-14ca0712e633'
						inbox='3793e40e-c090-4412-acd0-7e20a7dc9f8a'
						title='Welcome to Voyage'
						subtitle='Ask us anything in the chat window below 😊'
						primaryColor='#3646F5'
						position='right'
						greeting='Hi there! How can I help you?'
						newMessagePlaceholder='Start typing...'
						showAgentAvailability={false}
						agentAvailableText="We're online right now!"
						agentUnavailableText="We're away at the moment."
						requireEmailUpfront={false}
						iconVariant='outlined'
						baseUrl='https://app.papercups.io'
						styles={{
							toggleButton: {
								width: 60,
								height: 60
							},
							toggleContainer: {
								zIndex: 1000000,
								position: 'fixed'
							},
							chatContainer: {
								zIndex: 10000000,
								position: 'fixed'
							}
						}}
						// Optionally include data about your customer here to identify them
						customer={
							profile.id
								? {
										name: profile.fullName,
										email: profile.email,
										external_id: profile.id,
										metadata: {
											phone: profile.phone,
											company: profile.company
										},
										current_url: currentURL
								  }
								: undefined
						}
					/>
				)}
			</main>
		</div>
	);
};

export default Layout;
