import React, { useState } from 'react';
import { Tabs } from '@mantine/core';
import Trips from '../../containers/Trips';
import { STATUS } from '@voyage-app/shared-types';

const trips = () => {
	const [activeTab, setActiveTab] = useState(0);
	return (
		<div className='py-5 h-screen'>
			<Tabs active={activeTab} onTabChange={setActiveTab} grow>
				<Tabs.Tab label='Upcoming' tabKey={[STATUS.NEW, STATUS.PENDING].join(' ')} >
					<Trips statuses={[STATUS.NEW, STATUS.PENDING]} />
				</Tabs.Tab>
				<Tabs.Tab label='In Transit' tabKey={[STATUS.DISPATCHED, STATUS.EN_ROUTE].join(' ')} >
					<Trips statuses={[STATUS.EN_ROUTE, STATUS.DISPATCHED, STATUS.AT_DROPOFF, STATUS.AT_PICKUP]} />
				</Tabs.Tab>
				<Tabs.Tab label='Completed' tabKey={[STATUS.COMPLETED].join(' ')} >
					<Trips statuses={[STATUS.COMPLETED]}/>
				</Tabs.Tab>
			</Tabs>
		</div>
	);
};

export default trips;
