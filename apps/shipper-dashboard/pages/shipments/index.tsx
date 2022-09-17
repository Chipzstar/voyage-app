import React, { useEffect, useState } from 'react';
import { Tabs } from '@mantine/core';
import { PUBLIC_PATHS } from '../../utils/constants';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import { setShipments, getShipments, useShipments } from '../../store/features/shipmentsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchShipments } from '@voyage-app/shared-utils';
import { getToken } from 'next-auth/jwt';
import { AppDispatch, wrapper } from '../../store';
import { fetchShipper } from '../../utils/functions';
import { setShipper } from '../../store/features/profileSlice';
import { Shipment, STATUS } from '@voyage-app/shared-types';
import Shipments from '../../containers/Shipments';
import prisma from '../../db';

let subscriber;

const TAB_LABELS = {
	ALL: 'ALL',
	PENDING: 'PENDING',
	IN_TRANSIT: 'IN_TRANSIT',
	COMPLETED: 'COMPLETED'
};

const index = () => {
	const dispatch = useDispatch<AppDispatch>();
	const shipments = useSelector(useShipments);
	const [activeTab, setActiveTab] = useState<string | null>(TAB_LABELS.ALL);

	function fetch() {
		dispatch(getShipments())
			.unwrap()
			.then(() => console.log("fetching shipments!"));
	}

	useEffect(() => {
		subscriber = setInterval(fetch, 5000);
		return () => clearInterval(subscriber);
	}, []);

	return (
		<div className='h-screen p-4'>
			<div className='h-full px-4'>
				<section className='mb-8 flex h-20 flex-row items-center justify-between py-3'>
					<h2 className='page-header'>Shipment History</h2>
				</section>
				<Tabs value={activeTab} onTabChange={setActiveTab}>
					<Tabs.List grow>
						<Tabs.Tab value={TAB_LABELS.ALL}>All</Tabs.Tab>
						<Tabs.Tab value={TAB_LABELS.PENDING}>Pending</Tabs.Tab>
						<Tabs.Tab value={TAB_LABELS.IN_TRANSIT}>In Progress</Tabs.Tab>
						<Tabs.Tab value={TAB_LABELS.COMPLETED}>Completed</Tabs.Tab>
					</Tabs.List>

					<Tabs.Panel value={TAB_LABELS.ALL} className='text-lg'>
						<Shipments shipments={shipments} statuses={Object.values(STATUS)} message='You have no created shipments!' />
					</Tabs.Panel>
					<Tabs.Panel value={TAB_LABELS.PENDING} className='text-lg'>
						<Shipments shipments={shipments} statuses={[STATUS.NEW, STATUS.PENDING]} message='No shipments pending!' />
					</Tabs.Panel>
					<Tabs.Panel value={TAB_LABELS.IN_TRANSIT} className='text-lg'>
						<Shipments shipments={shipments} statuses={[STATUS.AT_PICKUP, STATUS.DISPATCHED, STATUS.AT_DROPOFF, STATUS.EN_ROUTE]} message='No shipments in transit' />
					</Tabs.Panel>
					<Tabs.Panel value={TAB_LABELS.COMPLETED} className='text-lg'>
						<Shipments shipments={shipments} statuses={[STATUS.COMPLETED]} message='No shipments completed' />
					</Tabs.Panel>
				</Tabs>
			</div>
		</div>
	);
};

export const getServerSideProps = wrapper.getServerSideProps(store => async ({ req, res }) => {
	// @ts-ignore
	const session = await unstable_getServerSession(req, res, authOptions);
	const token = await getToken({ req });
	if (!session) {
		return {
			redirect: {
				destination: PUBLIC_PATHS.LOGIN,
				permanent: false
			}
		};
	}
	if (session.id) {
		const shipper = await fetchShipper(session.id, token?.shipperId, prisma);
		store.dispatch(setShipper(shipper));
		const shipments = await fetchShipments(token?.shipperId, prisma);
		store.dispatch(setShipments(shipments));
	}
	return {
		props: {
			session
		}
	};
});

export default index;
