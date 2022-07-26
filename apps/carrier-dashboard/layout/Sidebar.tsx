import React, { useState } from 'react';
import { Logout } from 'tabler-icons-react';
import { PATHS } from '../utils/constants';
import Link from 'next/link';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import { useDispatch } from 'react-redux';

interface NavMenuItem {
	title: string
}

interface NavMenu {
	title: string
	href: string,
	submenu?: boolean
	menuItems?: NavMenuItem[]
}

const SideMenuItem = ({ title, href, isActive }) => {
	const wrapperStyles = classNames({
		'hover:bg-secondary-100': true,
		'bg-secondary-100': isActive
	});
	return (
		<li className={wrapperStyles}>
			<Link href={href}>
				<div role='button' className='p-4 flex items-center text-base font-normal text-gray-900'>
					<span className='ml-3 text-base md:text-lg'>{title}</span>
				</div>
			</Link>
		</li>
	);
};

const SideMenuDropdown = ({ title, href, isActive, options }) => {
	const [dropdownOpen, setDropdownOpen] = useState(false)
	const wrapperStyles = classNames({
		'hover:bg-secondary-100': true,
		'bg-secondary-100': isActive
	});
	const dropdownStyles = classNames({})
	return (
		<li onClick={() => setDropdownOpen(!dropdownOpen)}>
			<div role='button' className={`${wrapperStyles} p-4 flex items-center text-base font-normal text-gray-900`}>
				<span className='ml-3 mr-1 text-base md:text-lg'>{title}</span>
				<svg sidebar-toggle-item className='w-6 h-6' fill='currentColor' viewBox='0 0 20 20'
					 xmlns='http://www.w3.org/2000/svg'>
					<path fillRule='evenodd'
						  d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
						  clipRule='evenodd'></path>
				</svg>
			</div>
			{dropdownOpen && <ul id='dropdown-example' className='py-2 space-y-2 transition ease-in-out delay-150 duration-300'>
				{options.map(option => (
					<li>
						<a href='#'
						   className='flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 pl-11'>{option.title}</a>
					</li>
				))}
			</ul>}
		</li>
	);
};

const Sidebar = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const Menu: NavMenu[]  = [
		{
			title: 'Operations',
			href: PATHS.HOME,
			submenu: true,
			menuItems: [
				{ title: 'Truck Board' },
				{ title: 'Live Trips' }
			]
		},
		{ title: 'Marketplace', href: PATHS.MARKETPLACE },
		{
			title: 'Fleets', href: PATHS.FLEETS, submenu: true, menuItems: [
				{ title: 'Drivers' },
				{ title: 'Team' },
				{ title: 'Vehicles' }
			]
		},
		{
			title: 'Accounts',href: PATHS.ACCOUNTS, submenu: true, menuItems: [
				{ title: 'Customers' },
				{ title: 'Invoice' },
				{ title: 'Payment' }
			]
		},
		{
			title: 'Reporting', href: PATHS.REPORTING, submenu: true, menuItems: [
				{ title: 'Basic Reports' },
				{ title: 'Fuel' }
			]
		},
		{ title: 'Settings', href: PATHS.SETTINGS }
	];

	return (
		<div className='w-48 lg:w-64 h-full overflow-y-auto py-4 bg-gray-50 flex flex-col border-r-2 border-gray-300'>
			<Link href={PATHS.HOME}>
				<div role='button' className='flex flex-row items-center pl-6 mb-7'>
					<img src='/static/images/favicon.svg' className='mr-3 h-6 sm:h-7' alt='Voyage Logo' />
					<span className='self-center text-2xl font-semibold whitespace-nowrap mb-0.5'>voyage</span>
				</div>
			</Link>
			<ul className='grow space-y-4'>
				{Menu.map((item, index) => (
					item?.submenu ?
						<SideMenuDropdown
							key={index}
							title={item.title}
							href={item.href}
							isActive={false}
							options={item.menuItems}
						/> :
						<SideMenuItem key={index} title={item.title} href={item.href} isActive={false} />
				))}
			</ul>

			<div
				role='button'
				className='flex items-center p-4 text-base font-normal text-gray-900 hover:bg-secondary-100'
				onClick={() => {
					dispatch({ type: 'RESET' });
					signOut({ callbackUrl: `${window.location.origin}/login` }).then(r => console.log('Sign Out Success!'));
				}}
			>
				<Logout size={30} strokeWidth={1} color={'black'} />
				<span className='flex-1 ml-6 text-base md:text-lg whitespace-nowrap'>Sign Out</span>
			</div>
		</div>
	);
};

export default Sidebar;
