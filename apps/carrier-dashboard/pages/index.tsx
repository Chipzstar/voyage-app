import { CalendarFilter, DateRange } from '@voyage-app/shared-ui-components';
import React, { useMemo, useState } from 'react';
import moment from 'moment';
import Map from '../components/Map';
import TruckLoadTimeline from '../components/TruckLoadTimeline';
import PageHeader from '../layout/PageHeader';
import { PUBLIC_PATHS } from '../utils/constants';
import { unstable_getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import { authOptions } from './api/auth/[...nextauth]';
import prisma from '../db';
import { setCarrier } from '../store/feature/profileSlice';
import { wrapper } from '../store';
import { fetchLoads, fetchProfile } from '../utils/functions';
import { setLoads, useLoads } from '../store/feature/loadSlice';
import { useSelector } from 'react-redux';
import { STATUS } from '@voyage-app/shared-types';
import { MapType } from '../utils/types';

export function Index(props) {
	const [dateRange, setRange] = useState([moment().startOf('day').toDate(), moment().startOf('day').add(1, 'day').toDate()]);
	const loads = useSelector(useLoads);

	const activeCustomers = useMemo(() =>
		loads.filter(item => ![STATUS.COMPLETED, STATUS.CANCELLED].includes(item.status))
	, [loads]);

	return (
		<div className='py-4 px-8 h-full overflow-y-auto'>
			<div className='flex justify-between mb-5'>
				<PageHeader title='Truck Board' />
				<CalendarFilter current={dateRange as DateRange} setCurrent={setRange} />
			</div>
			<Map height={250} customers={activeCustomers} type={MapType.DASHBOARD} />
			<TruckLoadTimeline loads={loads} />
		</div>
	);
}

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
		let carrier = await fetchProfile(session.id, token?.carrierId, prisma);
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

export default Index;
