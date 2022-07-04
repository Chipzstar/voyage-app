import React from 'react';
import Sidebar from '../components/Sidebar';

const Layout = ({ children }) => {
	return (
		<div className='py-5 min-h-screen flex flex-row'>
			<Sidebar />
			<main className='grow'>
				{children}
			</main>
		</div>
	);
};

export default Layout;
