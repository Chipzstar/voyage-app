import React, { useState } from 'react';
import { Tabs } from '@mantine/core';
import Quotes from '../containers/Quotes';

const bookings = () => {
	const [activeTab, setActiveTab] = useState(1);
	return (
		<div className='p-4'>
			<div className='px-4'>
				<section className='flex flex-row items-center justify-between mb-8 py-3'>
					<h2 className='text-3xl font-semibold'>Bookings</h2>
					<button className='bg-secondary hover:bg-secondary-600 font-medium text-white h-12 w-36'>New Quote</button>
				</section>
				<Tabs active={activeTab} onTabChange={setActiveTab} grow>
					<Tabs.Tab label='Quotes'>
						<Quotes />
					</Tabs.Tab>
					<Tabs.Tab label='Booked'>You have no booked orders yet</Tabs.Tab>
				</Tabs>
			</div>
		</div>
	);
};

export default bookings;
