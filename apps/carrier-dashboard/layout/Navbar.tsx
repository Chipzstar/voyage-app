import React from 'react';
import { PATHS } from '../utils/constants';
import Link from 'next/link';

const Navbar = props => {
	return (
		<nav className='bg-white sm:px-4 md:px-0 py-2.5 border-b-voyage-grey border-b-2'>
			<div className='flex flex-wrap justify-between items-center mx-auto py-2 px-8'>
				<Link href={PATHS.HOME}>
					<div role='button' className='flex flex-row items-center pl-4 mb-0.5'>
						<img src='/static/images/favicon.svg' className='mr-3 h-6 sm:h-7' alt='Voyage Logo' />
						<span className='self-center text-2xl font-semibold whitespace-nowrap mb-0.5'>voyage</span>
					</div>
				</Link>
				<button data-collapse-toggle='navbar-default' type='button'
						className='inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 '
						aria-controls='navbar-default' aria-expanded='false'>
					<span className='sr-only'>Open main menu</span>
					<svg className='w-6 h-6' aria-hidden='true' fill='currentColor' viewBox='0 0 20 20'
						 xmlns='http://www.w3.org/2000/svg'>
						<path fillRule='evenodd'
							  d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
							  clipRule='evenodd'></path>
					</svg>
				</button>
				<div className='hidden md:block grow w-auto' id='navbar-default'>
					<ul className='flex flex-col justify-center space-x-12 mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium'>
						<li role="button" className='block py-2 nav-text hover:md:text-blue-700 md:p-0'>
							<span aria-current='page'>Dashboard</span>
						</li>
						<li role="button" className='block py-2 nav-text hover:md:text-blue-700 md:p-0'>
							<span aria-current='page'>Business</span>
						</li>
						<li role="button" className='block py-2 nav-text hover:md:text-blue-700 md:p-0'>
							<span aria-current='page'>Trips</span>
						</li>
						<li role="button" className='block py-2  nav-text hover:md:text-blue-700 md:p-0'>
							<span aria-current='page'>Loads</span>
						</li>
						<li role="button" className='block py-2  nav-text hover:md:text-blue-700 md:p-0'>
							<span aria-current='page'>Team</span>
						</li>
						<li role="button" className='block py-2  nav-text hover:md:text-blue-700 md:p-0'>
							<span aria-current='page'>Fleets</span>
						</li>
					</ul>
				</div>
				<div>
					<span role="button" className="md:grow justify-end py-2 px-4 nav-text md:hover:text-blue-700 md:p-0">
						<span>Settings</span>
					</span>
				</div>
			</div>
		</nav>
	);
};

Navbar.propTypes = {};

export default Navbar;
