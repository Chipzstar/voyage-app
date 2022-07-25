import React, {useState} from 'react';
import CalendarFilter from '../components/CalendarFilter';
import DashboardPanels from '../components/DashboardPanels';
import Map from '../components/Map';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { PUBLIC_PATHS } from '../utils/constants';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import { store } from '../store';
// @ts-ignore
import { prisma } from '@voyage-app/prisma-utils';
import { setShipments } from '../store/features/shipmentsSlice';

export function Index(props) {
	const dispatch = useDispatch();
	const [dateRange, setRange] = useState([
		moment().startOf('day').toDate(),
		moment().startOf('day').add(1, 'day').toDate()]
	);

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


export async function getServerSideProps({ req, res }) {
	// @ts-ignore
	const session = await unstable_getServerSession(req, res, authOptions)
	if (!session) {
		return {
			redirect: {
				destination: PUBLIC_PATHS.LOGIN,
				permanent: false,
			},
		}
	}
	let shipments = await prisma.shipment.findMany({
		where: {
			userId: {
				equals: session.id
			}
		},
		orderBy: {
			createdAt: 'desc'
		}
	})
	shipments = shipments.map(shipment => ({
		...shipment,
		createdAt: moment(shipment.createdAt).unix(),
		updatedAt: moment(shipment.updatedAt).unix()
	}))
	store.dispatch(setShipments(shipments))
	return {
		props: {
			session,
			initialState: store.getState()
		},
	}
}

export default Index
