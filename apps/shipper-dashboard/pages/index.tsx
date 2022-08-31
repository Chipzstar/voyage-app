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
import { getToken } from 'next-auth/jwt'
import { fetchShipments } from '../utils/functions';
import { wrapper } from '../store';

const Index = (props) => {
	const [dateRange, setRange] = useState([moment().startOf('day').toDate(), moment().startOf('day').add(1, 'day').toDate()]);

	return (
		<div className='p-4 h-full'>
			<div className='flex items-center justify-between pl-4 py-3'>
				<div className='flex flex-col justify-center'>
					<span className='text-4xl font-medium'>Home</span>
				</div>
				<CalendarFilter current={dateRange} setCurrent={setRange} />
			</div>
			<DashboardPanels dateRange={dateRange} />
			<div className='my-6'>
				<Map height={595} />
			</div>
		</div>
	);
}

export const getServerSideProps = wrapper.getServerSideProps(store => async ({ req, res }) => {
	// @ts-ignore
	const session = await unstable_getServerSession(req, res, authOptions);
	const token = await getToken({ req })
	console.log("\nHOMEPAGE")
	console.log(token)
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
			session
		}
	};
})

export default Index;
