import React from 'react';
import { useRouter } from 'next/router';
import { PATHS, PUBLIC_PATHS } from '../../utils/constants';
import Bookings from '../../containers/Bookings';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import { setShipments } from '../../store/features/shipmentSlice';
import { getToken } from 'next-auth/jwt';
import { fetchShipments } from '@voyage-app/shared-utils';
import { wrapper } from '../../store';
import { fetchBookings, fetchShipper } from '../../utils/functions';
import { setShipper, useShipper } from '../../store/features/profileSlice';
import { setBookings } from '../../store/features/bookingsSlice';
import prisma from '../../db';
import { useSelector } from 'react-redux';

const bookings = () => {
	const router = useRouter();
	const profile = useSelector(useShipper)
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
				<Bookings shipperInfo={profile} />
			</div>
		</div>
	);
};

export const getServerSideProps = wrapper.getServerSideProps(store => async ({req, res}) => {
	// @ts-ignore
	const session = await unstable_getServerSession(req, res, authOptions);
	const token = await getToken({req})
	if (!session) {
		return {
			redirect: {
				destination: PUBLIC_PATHS.LOGIN,
				permanent: false
			}
		};
	}
	if (session.id || token?.shipperId) {
		const shipper = await fetchShipper(session.id, token?.shipperId, prisma)
		store.dispatch(setShipper(shipper))
		const bookings = await fetchBookings(token?.shipperId, prisma)
		store.dispatch(setBookings(bookings))
		const shipments = await fetchShipments(token?.shipperId, prisma)
		store.dispatch(setShipments(shipments));
	}
	return {
		props: {
			session
		}
	};
})

export default bookings;
