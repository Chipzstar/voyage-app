import React, { useMemo } from 'react';
import Sidebar from './Sidebar';
import { useRouter } from 'next/router';
import { PUBLIC_PATHS } from '../utils/constants';
import { ChatWidget } from '@papercups-io/chat-widget';
import { useSelector } from 'react-redux';
import { useShipper } from '../store/features/profileSlice';

const Layout = ({ children }) => {
	const profile = useSelector(useShipper);
	const router = useRouter();
	const isAuthScreen = useMemo(() => !router.pathname.includes(PUBLIC_PATHS.LOGIN), [router.pathname]);

	const currentURL = useMemo(() => {
		return typeof window === 'undefined' ? `${process.env.NEXT_PUBLIC_HOST}${router.pathname}` : `${window.location.origin}${router.pathname}`;
	}, [router]);

	return (
		<div className='relative flex min-h-screen overflow-hidden'>
			{isAuthScreen && (
				<aside className='relative sticky top-0 h-screen' aria-label='Sidebar'>
					<Sidebar />
				</aside>
			)}
			<main className='h-screen grow overflow-y-auto'>
				{children}
			</main>
		</div>
	);
};

export default Layout;
