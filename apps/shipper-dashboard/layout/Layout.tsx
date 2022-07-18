import React from 'react';
import Sidebar from './Sidebar';
import { useRouter } from 'next/router';
import { PATHS } from '../utils/constants';

const Layout = ({ children }) => {
	const router = useRouter();
	return (
		<div className='min-h-screen flex relative overflow-hidden'>
			{!router.pathname.includes(PATHS.LOGIN) && <aside className='h-screen sticky top-0 relative' aria-label='Sidebar'>
				<Sidebar />
			</aside>}
			<main className='h-screen overflow-y-auto grow'>{children}</main>
		</div>
	);
};

export default Layout;
