import React, { useState } from 'react';
import CalendarFilter from '../components/CalendarFilter';
import DashboardPanels from '../components/DashboardPanels';
import Map from '../components/Map';
import moment from 'moment';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import prisma from '../db';
import { setShipments } from '../store/features/shipmentsSlice';
import { PUBLIC_PATHS } from '../utils/constants';
import { getToken } from 'next-auth/jwt';
import { DateRange } from '@voyage-app/shared-types';
import { fetchShipments } from '@voyage-app/shared-utils';
import { wrapper } from '../store';
import { setShipper } from '../store/features/profileSlice';
import { fetchShipper } from '../utils/functions';

const Index = props => {
	const [dateRange, setRange] = useState<DateRange>([moment().startOf('day').toDate(), moment().startOf('day').add(1, 'day').toDate()]);

	return (
		<div className='h-full p-4'>
			<div className='flex items-center justify-between py-3 pl-4'>
				<div className='flex flex-col justify-center'>
					<span className='text-4xl font-medium'>Home</span>
				</div>
				<CalendarFilter current={dateRange} setCurrent={setRange} />
			</div>
			<DashboardPanels dateRange={dateRange} />
			<div className='mt-6'>
				<Map height={335} />
			</div>
		</div>
	);
};

export const getServerSideProps = wrapper.getServerSideProps(store => async ({ req, res }) => {
	// @ts-ignore
	const session = await unstable_getServerSession(req, res, authOptions);
	const token = await getToken({ req });
	console.log('\nHOMEPAGE');
	console.log(token);
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
		const shipments = await fetchShipments(token?.shipperId, prisma);
		store.dispatch(setShipper(shipper));
		store.dispatch(setShipments(shipments));
	}
	return {
		props: {
			session
		}
	};
});

export default Index;
