import React from 'react';
import { Logout } from 'tabler-icons-react';
import { PATHS } from '../utils';
import Link from 'next/link';

const SideMenuItem = ({ title, icon, href }) => {
	return (
		<Link href={href}>
			<div role="button" className='flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-secondary-100 dark:hover:bg-gray-700'>
				<img src={icon} alt='' className='w-6 h-6' />
				<span className='ml-6 text-base md:text-lg'>{title}</span>
			</div>
		</Link>
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
						<SideMenuItem title='Home' icon='/static/images/home.svg' href={PATHS.HOME} />
					</li>
					<li>
						<SideMenuItem title='Bookings' icon='/static/images/bookings.svg' href={PATHS.BOOKINGS} />
					</li>
					<li>
						<SideMenuItem title='Shipments' icon='/static/images/shipments.svg' href={PATHS.SHIPMENTS} />
					</li>
					<li>
						<SideMenuItem title='Workflows' icon='/static/images/workflows.svg' href={PATHS.WORKFLOWS} />
					</li>
					<li>
						<SideMenuItem title='Billing' icon='/static/images/billing.svg' href={PATHS.BILLING} />
					</li>
				</ul>

				<a href='#' className='flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-secondary-100 dark:hover:bg-gray-700'>
					<Logout size={30} strokeWidth={1} color={'black'} />
					<span className='flex-1 ml-6 text-base md:text-lg whitespace-nowrap'>Sign Out</span>
				</a>
			</div>
		</aside>
	);
};

export default Sidebar;
