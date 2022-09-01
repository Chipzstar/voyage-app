import React, { useState } from 'react';
import { Tabs } from '@mantine/core';
import DataGrid from '../../components/DataGrid';
import { PATHS, PUBLIC_PATHS } from '../../utils/constants'
import { STATUS } from '../../utils/types';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import moment from 'moment';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import { useShipments, setShipments } from '../../store/features/shipmentsSlice';
import { useSelector } from 'react-redux';
import prisma from '../../db';
import { fetchShipments } from '@voyage-app/shared-utils';
import { getToken } from 'next-auth/jwt';
import { wrapper } from '../../store';

const Empty = ({ message }) => (
	<div className='mx-auto my-auto'>
		<span className='text-3xl my-auto mx-auto'>{message}</span>
	</div>
);

const TAB_LABELS = {
	ALL: 'ALL',
	PENDING: 'PENDING',
	IN_TRANSIT: 'IN_TRANSIT',
	COMPLETED: 'COMPLETED',
}

const STATUS_MAP = {
	ALL: Object.values(STATUS),
	PENDING: [STATUS.NEW , STATUS.PENDING],
	IN_TRANSIT: [STATUS.AT_PICKUP, STATUS.DISPATCHED, STATUS.AT_DROPOFF, STATUS.EN_ROUTE],
	COMPLETED: [STATUS.COMPLETED],
}

const index = ({ initialState }) => {
	const router = useRouter();
	const shipments = useSelector(useShipments);
	const [activeTab, setActiveTab] = useState<string | null>(TAB_LABELS.ALL);
	const [statuses, setStatuses] = useState(Object.values(STATUS))

	const rows = shipments
		.filter(element => statuses.includes(element.status))
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
		<div className='h-screen p-4'>
			<div className='h-full px-4'>
				<section className='mb-8 flex h-20 flex-row items-center justify-between py-3'>
					<h2 className='page-header'>Shipment History</h2>
				</section>
				<Tabs
					value={activeTab}
					onTabChange={value => {
						setActiveTab(value);
						setStatuses(STATUS_MAP[value]);
					}}
				>
					<Tabs.List grow>
						<Tabs.Tab value={TAB_LABELS.ALL}>All</Tabs.Tab>
						<Tabs.Tab value={TAB_LABELS.PENDING}>Pending</Tabs.Tab>
						<Tabs.Tab value={TAB_LABELS.IN_TRANSIT}>In Progress</Tabs.Tab>
						<Tabs.Tab value={TAB_LABELS.COMPLETED}>Completed</Tabs.Tab>
					</Tabs.List>

					<Tabs.Panel value={TAB_LABELS.ALL} className='text-lg'>
						<DataGrid rows={rows} headings={['Shipment ID', 'Status', 'Pickup', 'Delivery', '']} emptyContent={<Empty message='No shipments created' />} />
					</Tabs.Panel>
					<Tabs.Panel value={TAB_LABELS.PENDING} className='text-lg'>
						<DataGrid rows={rows} headings={['Shipment ID', 'Status', 'Pickup', 'Delivery', '']} emptyContent={<Empty message='No shipments pending' />} />
					</Tabs.Panel>
					<Tabs.Panel value={TAB_LABELS.IN_TRANSIT} className='text-lg'>
						<DataGrid rows={rows} headings={['Shipment ID', 'Status', 'Pickup', 'Delivery', '']} emptyContent={<Empty message='No shipments in transit' />} />
					</Tabs.Panel>
					<Tabs.Panel value={TAB_LABELS.COMPLETED} className='text-lg'>
						<DataGrid rows={rows} headings={['Shipment ID', 'Status', 'Pickup', 'Delivery', '']} emptyContent={<Empty message={'No shipments completed'} />} />
					</Tabs.Panel>
				</Tabs>
			</div>
		</div>
	);
};

export const getServerSideProps = wrapper.getServerSideProps(store => async ({ req, res }) => {
	// @ts-ignore
	const session = await unstable_getServerSession(req, res, authOptions);
	const token = await getToken({ req })
	if (!session) {
		return {
			redirect: {
				destination: PUBLIC_PATHS.LOGIN,
				permanent: false
			}
		};
	}
	if (session.id) {
		const shipments = await fetchShipments(token?.shipperId, prisma)
		store.dispatch(setShipments(shipments));
	}
	return {
		props: {

		}
	};
})

export default index;
