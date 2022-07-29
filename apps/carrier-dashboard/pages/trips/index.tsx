import React, { useState } from 'react';
import { Tabs } from '@mantine/core';
import Trips from '../../containers/Trips';
import { STATUS } from '@voyage-app/shared-types';

const trips = () => {
	const [activeTab, setActiveTab] = useState(0);
	return (
		<div className='py-5 h-screen'>
			<header className="page-header px-5 mb-5">Live Trips</header>
			<Tabs active={activeTab} onTabChange={setActiveTab} grow>
				<Tabs.Tab label='Upcoming' tabKey={[STATUS.NEW, STATUS.PENDING].join(' ')} >
					<Trips statuses={[STATUS.NEW, STATUS.PENDING]} message={<span className="text-center text-2xl">You have no upcoming loads!"</span>} />
				</Tabs.Tab>
				<Tabs.Tab label='In Transit' tabKey={[STATUS.DISPATCHED, STATUS.EN_ROUTE].join(' ')} >
					<Trips statuses={[STATUS.EN_ROUTE, STATUS.DISPATCHED, STATUS.AT_DROPOFF, STATUS.AT_PICKUP]} message={<span className="text-center text-2xl">You have no loads in-transit</span>} />
				</Tabs.Tab>
				<Tabs.Tab label='Completed' tabKey={[STATUS.COMPLETED].join(' ')}>
					<Trips statuses={[STATUS.COMPLETED]} message={<span className="text-center text-2xl">You have no completed trips</span>}/>
				</Tabs.Tab>
			</Tabs>
		</div>
	);
};

export default trips;
