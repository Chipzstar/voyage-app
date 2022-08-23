import React from 'react';
import { useRouter } from 'next/router';
import { PATHS, PUBLIC_PATHS } from '../../utils/constants';
import Bookings from '../../containers/Bookings';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import getStore from '../../store';
import prisma from '../../db';
import { setShipments } from '../../store/features/shipmentsSlice';
import { getToken } from 'next-auth/jwt';
import { fetchShipments } from '../../utils/functions';

const bookings = () => {
	const router = useRouter();
	return (
		<div className='p-4 h-screen'>
			<div className='px-4 flex flex-col h-full'>
				<section className='flex flex-row items-center justify-between mb-4 py-3'>
					<h2 className='page-header'>Bookings</h2>
					<div className='flex space-x-6'>
						<button className='voyage-button h-12 w-auto px-4' onClick={() => router.push(PATHS.BOOKING_CALENDAR)}>
							Booking Calendar
						</button>
						<button className='voyage-button h-12 w-36' onClick={() => router.push(PATHS.CREATE_BOOKING)}>
							New Booking
						</button>
					</div>
				</section>
				<Bookings />
			</div>
		</div>
	);
};

export async function getServerSideProps({ req, res }) {
	// @ts-ignore
	const session = await unstable_getServerSession(req, res, authOptions);
	const token = await getToken(({req}))
	const store = getStore();
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
			initialState: store.getState()
		}
	};
}

export default bookings;
