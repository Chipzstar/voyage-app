import React, { useMemo } from 'react';
import Sidebar from './Sidebar';
import { useRouter } from 'next/router';
import { PUBLIC_PATHS } from '../utils/constants';

const Layout = ({ children }) => {
	const router = useRouter();
	const isAuthScreen = useMemo(() => ![PUBLIC_PATHS.LOGIN, PUBLIC_PATHS.SIGNUP].includes(router.pathname), [router.pathname]);
	return (
		<div className='relative flex min-h-screen'>
			{isAuthScreen && (
				<aside className='relative sticky top-0 h-screen' aria-label='Sidebar'>
					<Sidebar />
				</aside>
			)}
			<main className='min-h-screen grow overflow-hidden'>{children}</main>
		</div>
	);
};

export default Layout;
