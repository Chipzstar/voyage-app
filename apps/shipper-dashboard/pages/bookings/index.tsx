import React, { useState } from 'react';
import { Tabs } from '@mantine/core';
import Quotes from '../../containers/Quotes';
import { useRouter } from 'next/router';
import { PATHS } from '../../utils';

const bookings = () => {
	const [activeTab, setActiveTab] = useState(0);
	const router = useRouter()
	return (
		<div className='p-4 h-full'>
			<div className='px-4 h-full'>
				<section className='flex flex-row items-center justify-between mb-8 py-3'>
					<h2 className='page-header'>Bookings</h2>
					<button className='bg-secondary hover:bg-secondary-600 font-medium text-white h-12 w-36' onClick={() => router.push(PATHS.QUOTE)}>New Quote</button>
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
