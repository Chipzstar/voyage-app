import React from 'react';
import Sidebar from './Sidebar';
import { useRouter } from 'next/router';
import { PUBLIC_PATHS } from '../utils/constants';

const Layout = ({ children }) => {
	const router = useRouter();
	return (
		<div className='min-h-screen flex relative font-helvetica'>
			{!router.pathname.includes(PUBLIC_PATHS.LOGIN) && (
				<aside className='h-screen sticky top-0 relative' aria-label='Sidebar'>
					<Sidebar />
				</aside>
			)}
			<main className='min-h-screen grow overflow-hidden'>{children}</main>
		</div>
	);
};

export default Layout;
