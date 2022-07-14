import React, { useState } from 'react';
import { Tabs } from '@mantine/core';
import DataGrid from '../../components/DataGrid';
import { PATHS, STATUSES } from '../../utils/constants';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import moment from 'moment';
import { useSelector } from 'react-redux';

const Empty = ({message}) => (
	<div className='mx-auto my-auto'>
		<span className='text-3xl my-auto mx-auto'>{message}</span>
	</div>
);

const index = () => {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState({ index: 0, statuses: STATUSES });
	const shipments = useSelector(state => state['shipments']);

	const rows = shipments.filter(element => activeTab.statuses.includes(element.status)).map((element, index) => {
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
			'bg-en-route-400': element.status === 'en-route',
			'bg-completed-300': element.status === 'completed',
			'bg-cancelled-300': element.status === 'cancelled'
		});
		return (
			<tr key={index}>
				<td colSpan={1}>
					<span className='text-secondary font-semibold text-lg'>{element.id}</span>
				</td>
				<td colSpan={1}>
					<div className={statusClass}>
						<span>{element.status}</span>
					</div>
				</td>
				<td colSpan={1}>
					<div className='flex flex-col flex-shrink'>
						<span>{element.pickup.facilityName}</span>
						<span>{element.pickup.location}</span>
						{element.delivery.window ? <span>
							{moment.unix(element.pickup.window.start).format("HH:mm")} - {moment.unix(element.pickup.window.end).format("HH:mm DD MMM")}
						</span> : <span>Estimating delivery window...</span>}
					</div>
				</td>
				<td colSpan={1}>
					<div className='flex flex-col flex-shrink'>
						<span>{element.delivery.facilityName}</span>
						<span>{element.delivery.location}</span>
						<span>
							{moment.unix(element.delivery?.window?.start).format("HH:mm")} - {moment.unix(element.delivery?.window?.end).format("HH:mm DD MMM")}
						</span>
					</div>
				</td>
				<td role='button' colSpan={2}>
					<button className='bg-transparent flex grow hover:underline' onClick={() => router.push(`${PATHS.SHIPMENTS}/${element.id}`)}>
						<span className='text-secondary font-semibold text-lg'>View</span>
					</button>
				</td>
			</tr>
		);
	});

	return (
		<div className='p-4 h-screen'>
			<div className='px-4 h-full'>
				<section className='flex flex-row items-center justify-between mb-8 py-3 h-20'>
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
					<Tabs.Tab label='All' tabKey={STATUSES.join(' ')} className="text-lg">
						<DataGrid rows={rows} headings={['Shipment ID', 'Status', 'Pickup', 'Delivery', '']} emptyContent={<Empty message="No shipments created" />} />
					</Tabs.Tab>
					<Tabs.Tab label='Pending' tabKey='new pending' className="text-lg">
						<DataGrid rows={rows} headings={['Shipment ID', 'Status', 'Pickup', 'Delivery', '']} emptyContent={<Empty message="No shipments pending" />} />
					</Tabs.Tab>
					<Tabs.Tab label='In Progress' tabKey='dispatched en-route' className="text-lg">
						<DataGrid rows={rows} headings={['Shipment ID', 'Status', 'Pickup', 'Delivery', '']} emptyContent={<Empty message="No shipments in -transit"/>} />
					</Tabs.Tab>
					<Tabs.Tab label='Completed' tabKey='completed' className="text-lg">
						<DataGrid rows={rows} headings={['Shipment ID', 'Status', 'Pickup', 'Delivery', '']} emptyContent={<Empty message={"No shipments completed"} />} />
					</Tabs.Tab>
				</Tabs>
			</div>
		</div>
	);
};

export default index;
