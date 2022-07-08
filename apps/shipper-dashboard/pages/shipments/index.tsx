import React, { useState } from 'react';
import { Tabs } from '@mantine/core';
import DataGrid from '../../components/DataGrid';
import { SAMPLE_SHIPMENTS } from '../../utils';
import { ChevronDown } from 'tabler-icons-react';
import classNames from 'classnames';

const index = () => {
	const [activeTab, setActiveTab] = useState(0);

	const rows = SAMPLE_SHIPMENTS.map(element => {
		const statusClass = classNames({
			'py-1.5': true,
			'w-28': true,
			'rounded': true,
			'text-center': true,
			'capitalize': true,
			'text-white': true,
			'text-lg': true,
			'bg-new': element.status === "new",
			'bg-pending-400': element.status === "pending",
			'bg-dispatched-400': element.status === "dispatched",
			'bg-en-route': element.status === "en-route",
			'bg-completed': element.status === "completed",
			'bg-cancelled': element.status === "cancelled",
		})
		return (
			<tr key={element.shipmentID}>
				<td>
					<span className='text-secondary font-semibold text-lg'>{element.shipmentID}</span>
				</td>
				<td>
					<div className={statusClass}>
						<span>{element.status}</span>
					</div>
				</td>
				<td>
					<div className='flex flex-col flex-shrink'>
						<span>{element.pickup.facility}</span>
						<span>{element.pickup.location}</span>
						<span>
							{element.pickup.window.start} - {element.pickup.window.end}
						</span>
					</div>
				</td>
				<td>
					<div className='flex flex-col flex-shrink'>
						<span>{element.delivery.facility}</span>
						<span>{element.delivery.location}</span>
						<span>
							{element.delivery.window.start} - {element.delivery.window.end}
						</span>
					</div>
				</td>
				<td role='button'>
					<ChevronDown size={32} strokeWidth={1} color={'black'} />
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
				<Tabs active={activeTab} onTabChange={setActiveTab} grow>
					<Tabs.Tab label='All'>
						<DataGrid rows={rows} headings={['Shipment ID', 'Status', 'Pickup', 'Delivery', '']} />
					</Tabs.Tab>
					<Tabs.Tab label='Pending'>
						<div className='py-5 booking-container flex'>
							<div className='mx-auto my-auto'>
								<span className='text-3xl my-auto mx-auto'>No Shipments created</span>
							</div>
						</div>
					</Tabs.Tab>
					<Tabs.Tab label='In Progress'>
						<div className='py-5 booking-container flex'>
							<div className='mx-auto my-auto'>
								<span className='text-3xl my-auto mx-auto'>No Shipments created</span>
							</div>
						</div>
					</Tabs.Tab>
					<Tabs.Tab label='Completed'>
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
