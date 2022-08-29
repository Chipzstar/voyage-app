import React, { useEffect, useMemo, useState } from 'react';
import { Logout } from 'tabler-icons-react';
import { PATHS } from '../utils/constants';
import Link from 'next/link';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';
import { Badge, ScrollArea, Stack, Text } from '@mantine/core';
import { useCarrier } from '../store/feature/profileSlice';
import { SignupStatus } from '../utils/types';

interface NavMenuItem {
	title: string;
	href: string;
	isActive: boolean;
}

interface NavMenu {
	title: string;
	href: string;
	isActive: boolean;
	submenu?: boolean;
	menuItems?: NavMenuItem[];
}

interface SideMenuDropdownProps {
	title: string;
	isActive: boolean;
	options: NavMenuItem[];
}

const SideMenuItem = ({ title, href, isActive }) => {
	const wrapperStyles = classNames({
		'hover:bg-secondary-100': true,
		'bg-secondary-100': isActive
	});
	return (
		<li className={wrapperStyles}>
			<Link href={href}>
				<div role='button' className='flex items-center p-4 text-base font-normal text-gray-900'>
					<span className='ml-3 text-base md:text-lg'>{title}</span>
				</div>
			</Link>
		</li>
	);
};

const SideMenuDropdown = ({ title, isActive, options }: SideMenuDropdownProps) => {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const wrapperStyles = classNames({
		'hover:bg-secondary-100': true,
		'bg-secondary-100': isActive
	});

	return (
		<li>
			<div role='button' className={`${wrapperStyles} flex items-center p-4 text-base font-normal text-gray-900`} onClick={() => setDropdownOpen(!dropdownOpen)}>
				<span className='ml-3 mr-1 text-base md:text-lg'>{title}</span>
				<svg className='h-6 w-6' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
					<path fillRule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clipRule='evenodd'></path>
				</svg>
			</div>
			{dropdownOpen && (
				<ul id='dropdown-example' className='space-y-2 py-2 transition delay-150 duration-300 ease-in-out'>
					{options.map((option, index) => {
						const dropdownStyles = classNames({
							'hover:bg-gray-200': true,
							'bg-gray-200': option.isActive
						});
						return (
							<li key={index} role='button' className={`${dropdownStyles}`}>
								<Link href={option.href}>
									<div className='group flex w-full items-center p-2 pl-11 text-base font-normal text-gray-900 transition duration-75'>
										<span>{option.title}</span>
										{option.href === PATHS.MARKETPLACE && (
											<Badge className='ml-1' color='green'>
												Coming Soon
											</Badge>
										)}
									</div>
								</Link>
							</li>
						);
					})}
				</ul>
			)}
		</li>
	);
};

const Sidebar = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const carrier = useSelector(useCarrier);

	useEffect(() => console.log('SIDEBAR:', carrier.status), [carrier]);

	const isDisabled = useMemo(() => carrier.status !== SignupStatus.COMPLETE, [carrier.status]);

	const operationsRoute = useMemo(() => [PATHS.HOME, PATHS.TRIPS, PATHS.TRIPS, PATHS.MARKETPLACE].includes(router.pathname), [router.pathname]);
	const Menu: NavMenu[] = [
		{
			title: 'Operations',
			isActive: operationsRoute,
			href: PATHS.HOME,
			submenu: true,
			menuItems: [
				{ title: 'Truck Board', href: PATHS.HOME, isActive: router.pathname === PATHS.HOME },
				{ title: 'Live Trips', href: PATHS.TRIPS, isActive: router.pathname === PATHS.TRIPS },
				{ title: 'Marketplace', href: PATHS.MARKETPLACE, isActive: router.pathname.includes(PATHS.MARKETPLACE) }
			]
		},
		{
			title: 'Fleets',
			href: PATHS.FLEETS,
			isActive: router.pathname.includes(PATHS.FLEETS),
			submenu: true,
			menuItems: [
				{ title: 'Drivers', href: PATHS.DRIVERS, isActive: router.pathname.includes(PATHS.DRIVERS) },
				{ title: 'Team', href: PATHS.TEAM, isActive: router.pathname.includes(PATHS.TEAM) },
				{ title: 'Vehicles', href: PATHS.VEHICLES, isActive: router.pathname.includes(PATHS.VEHICLES) }
			]
		},
		{
			title: 'Accounts',
			href: PATHS.ACCOUNTS,
			isActive: router.pathname.includes(PATHS.ACCOUNTS),
			submenu: true,
			menuItems: [
				{ title: 'Customers', href: PATHS.CUSTOMERS, isActive: router.pathname.includes(PATHS.CUSTOMERS) },
				{ title: 'Payment', href: PATHS.PAYMENTS, isActive: router.pathname.includes(PATHS.PAYMENTS) }
			]
		},
		{
			title: 'Reporting',
			href: PATHS.REPORTING,
			submenu: true,
			isActive: router.pathname.includes(PATHS.REPORTING),
			menuItems: [
				{
					title: 'Basic Reports',
					href: PATHS.BASIC_REPORT,
					isActive: router.pathname === PATHS.BASIC_REPORT
				},
				{ title: 'Fuel', href: PATHS.FUEL_REPORT, isActive: router.pathname === PATHS.FUEL_REPORT }
			]
		},
		{ title: 'Settings', href: PATHS.SETTINGS, isActive: router.pathname.includes(PATHS.SETTINGS) }
	];

	return isDisabled ? (
		<div className='flex h-full w-48 flex-col items-center justify-center border-r-2 border-gray-300 bg-gray-50 py-4 lg:w-64'>
			<Stack align="center">
				<img src='/static/images/inventory-management-system.png' alt='' />
				<Text size="xl" weight="bold" align="center">Please complete your account registration</Text>
			</Stack>

		</div>
	) : (
		<div className='flex h-full w-48 flex-col border-r-2 border-gray-300 bg-gray-50 py-4 lg:w-64'>
			<Link href={PATHS.HOME}>
				<div role='button' className='mb-7 flex flex-row items-center pl-6'>
					<img src='/static/images/logo.svg' className='mr-3 h-6 sm:h-7' alt='Voyage Logo' />
					<span className='mb-0.5 self-center whitespace-nowrap text-2xl font-semibold'>voyage</span>
				</div>
			</Link>
			<ScrollArea style={{ width: '100%', height: '100%' }}>
				<ul className='grow space-y-4'>
					{Menu.map((item, index) =>
						item?.submenu ? <SideMenuDropdown key={index} title={item.title} isActive={item.isActive} options={item.menuItems} /> : <SideMenuItem key={index} title={item.title} href={item.href} isActive={false} />
					)}
				</ul>
			</ScrollArea>
			<div
				role='button'
				className='hover:bg-secondary-100 flex items-center p-4 text-base font-normal text-gray-900'
				onClick={() => {
					dispatch({ type: 'RESET' });
					signOut({ callbackUrl: `${window.location.origin}/login` }).then(r => console.log('Sign Out Success!'));
				}}
			>
				<Logout size={30} strokeWidth={1} color={'black'} />
				<span className='ml-6 flex-1 whitespace-nowrap text-base md:text-lg'>Sign Out</span>
			</div>
		</div>
	);
};

export default Sidebar;
