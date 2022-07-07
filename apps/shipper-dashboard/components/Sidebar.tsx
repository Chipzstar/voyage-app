import React from 'react';
import { Logout } from 'tabler-icons-react';
import { PATHS } from '../utils';
import Link from 'next/link';
import classNames from 'classnames';
import { useRouter } from 'next/router';

const SideMenuItem = ({ title, icon, href, isActive }) => {
	const wrapperStyles = classNames({
		'hover:bg-secondary-100': true,
		'dark:hover:bg-gray-700': true,
		'bg-secondary-100': isActive
	});

	return (
		<li className={wrapperStyles}>
			<Link href={href}>
				<div role='button' className='p-4 flex items-center text-base font-normal text-gray-900 dark:text-white'>
					<img src={icon} alt='' className='w-6 h-6' />
					<span className='ml-6 text-base md:text-lg'>{title}</span>
				</div>
			</Link>
		</li>
	);
};

const Sidebar = () => {
	const router = useRouter();
	return (
		<div className='w-64 h-full overflow-y-auto py-4 bg-gray-50 dark:bg-gray-800 flex flex-col border-r-2 border-gray-300'>
			<Link href={PATHS.HOME}>
				<div role='button' className='flex flex-row items-center pl-4 mb-7'>
					<img src='/static/images/favicon.svg' className='mr-3 h-6 sm:h-7' alt='Voyage Logo' />
					<span className='self-center text-2xl font-semibold whitespace-nowrap dark:text-white mb-0.5'>voyage</span>
				</div>
			</Link>
			<ul className='grow space-y-4'>
				<SideMenuItem title='Home' icon='/static/images/home.svg' href={PATHS.HOME} isActive={router.pathname === PATHS.HOME} />
				<SideMenuItem title='Bookings' icon='/static/images/bookings.svg' href={PATHS.BOOKINGS} isActive={router.pathname.includes(PATHS.BOOKINGS)} />
				<SideMenuItem title='Shipments' icon='/static/images/shipments.svg' href={PATHS.SHIPMENTS} isActive={router.pathname.includes(PATHS.SHIPMENTS)} />
				<SideMenuItem title='Workflows' icon='/static/images/workflows.svg' href={PATHS.WORKFLOWS} isActive={router.pathname.includes(PATHS.WORKFLOWS)} />
				<SideMenuItem title='Billing' icon='/static/images/billing.svg' href={PATHS.BILLING} isActive={router.pathname.includes(PATHS.BILLING)} />
			</ul>

			<a href='#' className='flex items-center p-4 text-base font-normal text-gray-900 dark:text-white hover:bg-secondary-100 dark:hover:bg-gray-700'>
				<Logout size={30} strokeWidth={1} color={'black'} />
				<span className='flex-1 ml-6 text-base md:text-lg whitespace-nowrap'>Sign Out</span>
			</a>
		</div>
	);
};

export default Sidebar;
