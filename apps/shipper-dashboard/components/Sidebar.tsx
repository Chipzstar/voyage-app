import React from 'react';
import { Logout } from 'tabler-icons-react';
import styles from '../styles/layout.module.scss';

const SideMenuItem = ({ title, icon }) => {
	return (
		<a href='#' className='flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-menu-hover-100 dark:hover:bg-gray-700'>
			<img src={icon} alt='' className='w-6 h-6'/>
			<span className='ml-6 text-base md:text-lg'>{title}</span>
		</a>
	);
};

const Sidebar = () => {
	return (
		<aside className='w-64 h-screen' aria-label='Sidebar'>
			<div className='h-full overflow-y-auto py-4 px-3 bg-gray-50 dark:bg-gray-800 flex flex-col border-r-2 border-gray-300'>
				<a href='/' className='flex flex-row items-center pl-2.5 mb-7'>
					<img src='/static/images/favicon.svg' className='mr-3 h-6 sm:h-7' alt='Voyage Logo' />
					<span className='self-center text-2xl font-semibold whitespace-nowrap dark:text-white mb-0.5'>Voyage</span>
				</a>
				<ul className='grow space-y-6'>
					<li>
						<SideMenuItem title='Home' icon='/static/images/home.svg' />
					</li>
					<li>
						<SideMenuItem title='Bookings' icon='/static/images/bookings.svg' />
					</li>
					<li>
						<SideMenuItem title='Shipments' icon='/static/images/shipments.svg' />
					</li>
					<li>
						<SideMenuItem title='Workflows' icon='/static/images/workflows.svg' />
					</li>
					<li>
						<SideMenuItem title='Billing' icon='/static/images/billing.svg' />
					</li>
					{/*<li>
						<a href="#"
						   className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-menu-hover-100 dark:hover:bg-gray-700">
							<svg
								className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
								fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
								<path fillRule="evenodd"
									  d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z"
									  clipRule="evenodd"></path>
							</svg>
							<span className="flex-1 ml-3 whitespace-nowrap">Sign Up</span>
						</a>
					</li>*/}
				</ul>

				<a href='#' className='flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-menu-hover-100 dark:hover:bg-gray-700'>
					<Logout size={30} strokeWidth={1} color={'black'} />
					<span className='flex-1 ml-6 text-base md:text-lg whitespace-nowrap'>Sign Out</span>
				</a>
			</div>
		</aside>
	);
};

export default Sidebar;
