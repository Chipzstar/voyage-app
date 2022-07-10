import React, { useState } from 'react';
import { Tabs } from '@mantine/core';
import CarrierPreferences from '../../containers/CarrierPreferences';

const index = () => {
	const [activeTab, setActiveTab] = useState(0);
	return (
		<div className='p-4 h-screen'>
			<div className='px-4 h-full'>
				<Tabs active={activeTab} onTabChange={setActiveTab} grow >
					<Tabs.Tab label='Carrier Preferences' className="text-lg">
							<CarrierPreferences/>
					</Tabs.Tab>
					<Tabs.Tab label='Locations' className="text-lg">
						<div className='py-5 booking-container flex'>
							<div className='mx-auto my-auto'>
								<span className='text-3xl my-auto mx-auto'>No Shipments created</span>
							</div>
						</div>
					</Tabs.Tab>
				</Tabs>
			</div>
		</div>
	);
};

export default index;
