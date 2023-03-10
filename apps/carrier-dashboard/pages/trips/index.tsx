import React, { useEffect, useState } from 'react';
import { Tabs } from '@mantine/core';
import Trips from '../../containers/Trips';
import { STATUS } from '@voyage-app/shared-types';
import PageContainer from '../../layout/PageContainer';
import { fetchLoads, fetchCarrier } from '../../utils/functions';
import prisma from '../../db';
import { setCarrier } from '../../store/features/profileSlice';
import { setLoads, getLoads } from '../../store/features/loadSlice';
import { AppDispatch, wrapper } from '../../store';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import { getToken } from 'next-auth/jwt';
import { PUBLIC_PATHS } from '../../utils/constants';
import { useDispatch } from 'react-redux';

let subscriber;

const TAB_LABELS = {
	UPCOMING: 'upcoming',
	IN_TRANSIT: 'in-transit',
	COMPLETED: 'completed',
	LATE: 'late'
};

const trips = () => {
	const dispatch = useDispatch<AppDispatch>();
	const [activeTab, setActiveTab] = useState<string | null>(TAB_LABELS.UPCOMING);

	function fetch() {
		dispatch(getLoads()).unwrap().then(r => null);
	}

	useEffect(() => {
		subscriber = setInterval(fetch, 5000);
		return () => clearInterval(subscriber);
	}, []);

	return (
		<PageContainer classNames="pb-5 h-screen">
			<Tabs value={activeTab} onTabChange={setActiveTab}>
				<Tabs.List grow>
					<Tabs.Tab value={TAB_LABELS.UPCOMING}>Upcoming</Tabs.Tab>
					<Tabs.Tab value={TAB_LABELS.IN_TRANSIT}>In Transit</Tabs.Tab>
					<Tabs.Tab value={TAB_LABELS.COMPLETED}>Completed</Tabs.Tab>
					<Tabs.Tab value={TAB_LABELS.LATE}>Late</Tabs.Tab>
				</Tabs.List>

				<Tabs.Panel value={TAB_LABELS.UPCOMING}>
					<Trips
						statuses={[STATUS.NEW, STATUS.PENDING]}
						message={<span className='text-center text-2xl'>You have no upcoming loads!</span>}
					/>
				</Tabs.Panel>
				<Tabs.Panel value={TAB_LABELS.IN_TRANSIT}>
					<Trips
						statuses={[STATUS.EN_ROUTE, STATUS.DISPATCHED, STATUS.AT_DROPOFF, STATUS.AT_PICKUP]}
						message={<span className='text-center text-2xl'>You have no loads in-transit</span>}
					/>
				</Tabs.Panel>
				<Tabs.Panel value={TAB_LABELS.COMPLETED}>
					<Trips statuses={[STATUS.COMPLETED]} message={<span className='text-center text-2xl'>You have no completed trips</span>} />
				</Tabs.Panel>
				<Tabs.Panel value={TAB_LABELS.LATE}>
					<Trips statuses={[]} message={<span className='text-center text-2xl'>All your trips are on schedule!</span>} />
				</Tabs.Panel>
			</Tabs>
		</PageContainer>
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
	if (session.id || token?.carrierId) {
		let carrier = await fetchCarrier(session.id, token?.carrierId, prisma);
		let loads = await fetchLoads(token?.carrierId, prisma);
		store.dispatch(setCarrier(carrier));
		store.dispatch(setLoads(loads));
	}
	return {
		props: {
			session
		}
	};
});

export default trips;
