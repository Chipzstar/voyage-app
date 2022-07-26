import React from 'react';
import Navbar from './Navbar';
import {useRouter} from 'next/router';
import {PUBLIC_PATHS} from '../utils/constants';

const Layout = ({ children }) => {
	const router = useRouter();
	return (
		<div className='h-screen flex flex-col relative overflow-hidden'>
			{!router.pathname.includes(PUBLIC_PATHS.LOGIN) && <aside className='sticky top-0 relative' aria-label='Sidebar'>
				<Navbar />
			</aside>}
			<main className='h-screen overflow-y-auto grow	'>{children}</main>
		</div>
	);
};

export default Layout;
