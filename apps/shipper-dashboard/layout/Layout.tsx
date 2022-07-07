import React from 'react';
import Sidebar from '../components/Sidebar';

const Layout = ({ children }) => {
	return (
		<div className='min-h-screen flex relative overflow-hidden'>
			<aside className='h-screen sticky top-0 relative' aria-label='Sidebar'>
				<Sidebar />
			</aside>
			<main className='h-screen overflow-y-auto grow'>{children}</main>
		</div>
	);
};

export default Layout;
