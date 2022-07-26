import React, { useState } from 'react';
import { Tabs } from '@mantine/core';
import DataGrid from '../../components/DataGrid';
import { PATHS } from '../../utils/constants';
import { STATUS } from '../../utils/types';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import moment from 'moment';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import { selectAllShipments, setShipments } from '../../store/features/shipmentsSlice';
import { useSelector } from 'react-redux';
import { store } from '../../store';
import prisma from '../../db';

const Empty = ({ message }) => (
	<div className='mx-auto my-auto'>
		<span className='text-3xl my-auto mx-auto'>{message}</span>
	</div>
);

const index = ({ initialState }) => {
	const router = useRouter();
	const shipments = useSelector(selectAllShipments);
	const [activeTab, setActiveTab] = useState({ index: 0, statuses: Object.values(STATUS) });

	const rows = shipments
		.filter(element => activeTab.statuses.includes(element.status))
		.map((element, index) => {
			const statusClass = classNames({
				'py-1.5': true,
				'w-28': true,
				rounded: true,
				'text-center': true,
				capitalize: true,
				'text-white': true,
				'text-lg': true,
				'bg-new': element.status === STATUS.NEW,
				'bg-pending-400': element.status === STATUS.PENDING,
				'bg-dispatched-400': element.status === STATUS.DISPATCHED,
				'bg-en-route-400': element.status === STATUS.EN_ROUTE,
				'bg-completed-300': element.status === STATUS.COMPLETED,
				'bg-cancelled-300': element.status === STATUS.CANCELLED
			});
			return (
				<tr key={index}>
					<td colSpan={1}>
						<span className='text-secondary font-semibold text-lg'>{element.shipmentId}</span>
					</td>
					<td colSpan={1}>
						<div className={statusClass}>
							<span className='lowercase capitalize'>{element.status}</span>
						</div>
					</td>
					<td colSpan={1}>
						<div className='flex flex-col flex-shrink'>
							<span>{element.pickup.facilityName}</span>
							<span>{element.pickup.location}</span>
							<span>
								{moment.unix(element.pickup.window.start).format('HH:mm')} - {moment.unix(element.pickup.window.end).format('HH:mm DD MMM')}
							</span>
						</div>
					</td>
					<td colSpan={1}>
						<div className='flex flex-col flex-shrink'>
							<span>{element.delivery.facilityName}</span>
							<span>{element.delivery.location}</span>
							{element.delivery.window ? (
								<span>
									{moment.unix(element.delivery?.window?.start).format('HH:mm')} - {moment.unix(element.delivery?.window?.end).format('HH:mm DD MMM')}
								</span>
							) : (
								<span>Estimating delivery window...</span>
							)}
						</div>
					</td>
					<td role='button' colSpan={2}>
						<button className='bg-transparent flex grow hover:underline' onClick={() => router.push(`${PATHS.SHIPMENTS}/${element.shipmentId}`)}>
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
						// @ts-ignore
						setActiveTab(prevState => ({
							...prevState,
							index: value,
							statuses: key.split(' ')
						}));
					}}
				>
					<Tabs.Tab label='All' tabKey={Object.values(STATUS).join(' ')} className='text-lg'>
						<DataGrid rows={rows} headings={['Shipment ID', 'Status', 'Pickup', 'Delivery', '']} emptyContent={<Empty message='No shipments created' />} />
					</Tabs.Tab>
					<Tabs.Tab label='Pending' tabKey={[STATUS.NEW, STATUS.PENDING].join(' ')} className='text-lg'>
						<DataGrid rows={rows} headings={['Shipment ID', 'Status', 'Pickup', 'Delivery', '']} emptyContent={<Empty message='No shipments pending' />} />
					</Tabs.Tab>
					<Tabs.Tab label='In Progress' tabKey={[STATUS.EN_ROUTE, STATUS.AT_PICKUP, STATUS.DISPATCHED, STATUS.AT_DROPOFF].join(' ')} className='text-lg'>
						<DataGrid rows={rows} headings={['Shipment ID', 'Status', 'Pickup', 'Delivery', '']} emptyContent={<Empty message='No shipments in -transit' />} />
					</Tabs.Tab>
					<Tabs.Tab label='Completed' tabKey={[STATUS.COMPLETED].join(' ')} className='text-lg'>
						<DataGrid rows={rows} headings={['Shipment ID', 'Status', 'Pickup', 'Delivery', '']} emptyContent={<Empty message={'No shipments completed'} />} />
					</Tabs.Tab>
				</Tabs>
			</div>
		</div>
	);
};

export async function getServerSideProps({ req, res }) {
	// @ts-ignore
	const session = await unstable_getServerSession(req, res, authOptions);
	if (session.id) {
		let shipments = await prisma.shipment.findMany({
			where: {
				userId: {
					equals: session.id
				}
			},
			orderBy: {
				createdAt: 'desc'
			}
		});
		shipments = shipments.map(shipment => ({
			...shipment,
			createdAt: moment(shipment.createdAt).unix(),
			updatedAt: moment(shipment.updatedAt).unix()
		}));
		console.log(shipments);
		store.dispatch(setShipments(shipments));
	}
	return {
		props: {
			initialState: store.getState()
		}
	};
}

export default index;
