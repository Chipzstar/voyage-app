import React, { useState } from 'react';
import { Tabs } from '@mantine/core';
import Trips from '../containers/Trips'

const trips = () => {
	const [activeTab, setActiveTab] = useState('upcoming');
	return (
		<div className='py-5 h-screen'>
			<Tabs value={activeTab} onTabChange={setActiveTab}>
				<Tabs.List grow>
					<Tabs.Tab value="upcoming">Upcoming</Tabs.Tab>
					<Tabs.Tab value="in-transit">In Transit</Tabs.Tab>
					<Tabs.Tab value="completed">Completed</Tabs.Tab>
				</Tabs.List>

				<Tabs.Panel value="upcoming" pt="xs">
					<Trips/>
				</Tabs.Panel>

				<Tabs.Panel value="in-transit" pt="xs">
					<Trips/>
				</Tabs.Panel>

				<Tabs.Panel value="completed" pt="xs">
					<Trips/>
				</Tabs.Panel>
			</Tabs>
		</div>
	);
};

export default trips;
