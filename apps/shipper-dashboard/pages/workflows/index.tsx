import React, { useState } from 'react';
import { Tabs } from '@mantine/core';
import CarrierPreferences from '../../containers/CarrierPreferences';
import Locations from '../../containers/Locations';

const index = () => {
	const [activeTab, setActiveTab] = useState(0);
	return (
		<div className='p-4 h-screen'>
			<div className='px-4 h-full'>
				<Tabs active={activeTab} onTabChange={setActiveTab} grow>
					<Tabs.Tab label='Carrier Preferences' className='text-lg'>
						<CarrierPreferences />
					</Tabs.Tab>
					<Tabs.Tab label='Locations' className='text-lg'>
						<Locations />
					</Tabs.Tab>
				</Tabs>
			</div>
		</div>
	);
};

export default index;
