import React, { useState } from 'react';
import { Tabs } from '@mantine/core';
import Trips from '../../containers/Trips';
import { STATUS } from '@voyage-app/shared-types';
import PageContainer from '../../layout/PageContainer'

const TAB_LABELS = {
	UPCOMING: 'upcoming',
	IN_TRANSIT: 'in-transit',
	COMPLETED: 'completed',
	LATE: 'late'
}

const trips = () => {
	const [activeTab, setActiveTab] = useState<string | null>(TAB_LABELS.UPCOMING);
	return (
		<PageContainer>
			<header className="page-header px-5 mb-5">Live Trips</header>
			<Tabs value={activeTab} onTabChange={setActiveTab}>
				<Tabs.List grow>
					<Tabs.Tab value={TAB_LABELS.UPCOMING}>Upcoming</Tabs.Tab>
					<Tabs.Tab value={TAB_LABELS.IN_TRANSIT}>In Transit</Tabs.Tab>
					<Tabs.Tab value={TAB_LABELS.COMPLETED}>Completed</Tabs.Tab>
					<Tabs.Tab value={TAB_LABELS.LATE}>Late</Tabs.Tab>
				</Tabs.List>

				<Tabs.Panel value={TAB_LABELS.UPCOMING}><Trips statuses={[STATUS.NEW, STATUS.PENDING]} message={<span className="text-center text-2xl">You have no upcoming loads!</span>} /></Tabs.Panel>
				<Tabs.Panel value={TAB_LABELS.IN_TRANSIT}><Trips statuses={[STATUS.EN_ROUTE, STATUS.DISPATCHED, STATUS.AT_DROPOFF, STATUS.AT_PICKUP]} message={<span className="text-center text-2xl">You have no loads in-transit</span>} /></Tabs.Panel>
				<Tabs.Panel value={TAB_LABELS.COMPLETED}><Trips statuses={[STATUS.COMPLETED]} message={<span className="text-center text-2xl">You have no completed trips</span>}/></Tabs.Panel>
				<Tabs.Panel value={TAB_LABELS.LATE}><Trips statuses={[]} message={<span className="text-center text-2xl">All your trips are on schedule!</span>}/></Tabs.Panel>
			</Tabs>
		</PageContainer>
	);
};

export default trips;
