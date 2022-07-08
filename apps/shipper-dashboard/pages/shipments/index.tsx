import React, { useState } from 'react';
import { Tabs } from '@mantine/core';
import DataGrid from '../../components/DataGrid';
import { SAMPLE_SHIPMENTS, STATUSES } from '../../utils';
import classNames from 'classnames';

const Empty = ({message}) => (
	<div className='mx-auto my-auto'>
		<span className='text-3xl my-auto mx-auto'>{message}</span>
	</div>
);

const index = () => {
	const [activeTab, setActiveTab] = useState({ index: 0, statuses: STATUSES });

	const rows = SAMPLE_SHIPMENTS.filter(element => activeTab.statuses.includes(element.status)).map((element, index) => {
		const statusClass = classNames({
			'py-1.5': true,
			'w-28': true,
			rounded: true,
			'text-center': true,
			capitalize: true,
			'text-white': true,
			'text-lg': true,
			'bg-new': element.status === 'new',
			'bg-pending-400': element.status === 'pending',
			'bg-dispatched-400': element.status === 'dispatched',
			'bg-en-route': element.status === 'en-route',
			'bg-completed': element.status === 'completed',
			'bg-cancelled': element.status === 'cancelled'
		});
		return (
			<tr key={index}>
				<td colSpan={1}>
					<span className='text-secondary font-semibold text-lg'>{element.shipmentID}</span>
				</td>
				<td colSpan={1}>
					<div className={statusClass}>
						<span>{element.status}</span>
					</div>
				</td>
				<td colSpan={1}>
					<div className='flex flex-col flex-shrink'>
						<span>{element.pickup.facility}</span>
						<span>{element.pickup.location}</span>
						<span>
							{element.pickup.window.start} - {element.pickup.window.end}
						</span>
					</div>
				</td>
				<td colSpan={1}>
					<div className='flex flex-col flex-shrink'>
						<span>{element.delivery.facility}</span>
						<span>{element.delivery.location}</span>
						<span>
							{element.delivery.window.start} - {element.delivery.window.end}
						</span>
					</div>
				</td>
				<td role='button' colSpan={2}>
					<button className='bg-transparent flex grow'>
						<span className='text-secondary font-semibold text-lg'>View</span>
					</button>
				</td>
			</tr>
		);
	});

	return (
		<div className='p-4 h-screen'>
			<div className='px-4 h-full'>
				<section className='flex flex-row items-center justify-between mb-8 py-4'>
					<h2 className='page-header'>Shipment History</h2>
				</section>
				<Tabs
					grow
					active={activeTab.index}
					onTabChange={(value, key) => {
						console.log(key);
						setActiveTab(prevState => ({
							...prevState,
							index: value,
							statuses: key.split(' ')
						}));
					}}
				>
					<Tabs.Tab label='All' tabKey={STATUSES.join(' ')}>
						<DataGrid rows={rows} headings={['Shipment ID', 'Status', 'Pickup', 'Delivery', '']} emptyContent={<Empty message="No shipments created" />} />
					</Tabs.Tab>
					<Tabs.Tab label='Pending' tabKey='new pending'>
						<DataGrid rows={rows} headings={['Shipment ID', 'Status', 'Pickup', 'Delivery', '']} emptyContent={<Empty message="No shipments pending" />} />
					</Tabs.Tab>
					<Tabs.Tab label='In Progress' tabKey='dispatched en-route'>
						<DataGrid rows={rows} headings={['Shipment ID', 'Status', 'Pickup', 'Delivery', '']} emptyContent={<Empty message="No shipments in -transit"/>} />
					</Tabs.Tab>
					<Tabs.Tab label='Completed' tabKey='completed'>
						<DataGrid rows={rows} headings={['Shipment ID', 'Status', 'Pickup', 'Delivery', '']} emptyContent={<Empty message={"No shipments completed"} />} />
					</Tabs.Tab>
				</Tabs>
			</div>
		</div>
	);
};

export default index;
