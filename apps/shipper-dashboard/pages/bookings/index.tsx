import React, { useState } from 'react';
import { Tabs } from '@mantine/core';
import { useRouter } from 'next/router';
import { PATHS } from '../../utils';
import Bookings from '../../containers/Bookings';

const bookings = () => {
	const [activeTab, setActiveTab] = useState(0);
	const router = useRouter();
	return (
		<div className='p-4 h-screen'>
			<div className='px-4 h-full'>
				<section className='flex flex-row items-center justify-between mb-4 py-3'>
					<h2 className='page-header'>Bookings</h2>
					<div className='flex space-x-6'>
						<button disabled className='voyage-button h-12 w-auto px-4' onClick={() => router.push(PATHS.BOOKING_CALENDAR)}>
							Booking Calendar
						</button>
						<button className='voyage-button h-12 w-36' onClick={() => router.push(PATHS.CREATE_BOOKING)}>
							New Booking
						</button>
					</div>
				</section>
				<Bookings />
			</div>
		</div>
	);
};

export default bookings;
