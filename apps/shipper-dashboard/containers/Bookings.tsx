import React from 'react';
import DataGrid from '../components/DataGrid';
import { PATHS, SAMPLE_SHIPMENTS } from '../utils/constants';
import { useRouter } from 'next/router';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { Shipment } from '../utils/types';
import { NewBooking } from '../utils/bookings/types';

const Empty = () => {
	const router = useRouter();
	return (
		<div className='space-y-8 h-full flex flex-col grow justify-center items-center'>
			<h3 className='text-5xl font-light'>Welcome to Voyage!</h3>
			<p className='text-xl'>Your middle mile shipping partner optimizing your shipments.</p>
			<button className='voyage-button' onClick={() => router.push(PATHS.CREATE_BOOKING)}>
				Make a new booking
			</button>
		</div>
	);
};

const Bookings = () => {
	const router = useRouter();
	const { bookings, shipments } = useSelector(state => ({
		bookings: state['bookings'],
		shipments: state['shipments']
	}));
	bookings.sort((a, b) => b.createdAt - a.createdAt);
	shipments.sort((a, b) => b.createdAt - a.createdAt);

	const rows = bookings
		.map((element: NewBooking) => (
			<tr key={element.id}>
				<td>{element.id}</td>
				<td>Incomplete</td>
				<td>-</td>
				<td>-</td>
				<td>-</td>
				<td role='button'>
					<span className='text-secondary' onClick={() => router.push(`${PATHS.CREATE_BOOKING}/?bookingId=${element.id}`)}>
						Finish booking
					</span>
				</td>
			</tr>
		))
		.concat(
			shipments.map((element: Shipment) => {
				const minWindow = moment.unix(element.delivery?.window?.start).diff(moment.unix(element?.pickup?.window.end), 'hours');
				const maxWindow = moment.unix(element.delivery?.window?.end).diff(moment.unix(element.pickup?.window.start), 'hours');
				return (
					<tr key={element.id}>
						<td>{element.id}</td>
						<td>{element.bookingStatus}</td>
						<td>£{element.rate}</td>
						{[minWindow, maxWindow].includes(NaN) ? <td>Estimating</td> : <td>{`${minWindow} - ${maxWindow} hours`}</td>}
						<td>{element.carrier?.name}</td>
						<td role='button'>
							<span className='text-secondary' onClick={() => router.push(`${PATHS.SHIPMENTS}/${element.id}`)}>
								View in shipments
							</span>
						</td>
					</tr>
				);
			})
		);

	return (
		<div className='py-5 booking-container'>
			<DataGrid rows={rows} headings={['Booking ID', 'Status', 'Rate', 'Time Window', 'Carrier', '']} emptyContent={<Empty />} />
		</div>
	);
};

export default Bookings;
