import React from 'react';
import DataGrid from '../components/DataGrid';
import { PATHS, SAMPLE_SHIPMENTS } from '../utils/constants';
import { useRouter } from 'next/router';
import moment from 'moment';

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
	const rows = SAMPLE_SHIPMENTS.map(element => {
		const minWindow = moment(element.delivery.window.start).diff(moment(element.pickup.window.end), "hours")
		const maxWindow = moment(element.delivery.window.end).diff(moment(element.pickup.window.start), "hours")
		return (
			<tr key={element.shipmentID}>
				<td>{element.shipmentID}</td>
				<td>{element.bookingStatus}</td>
				<td>{element.pricePerKg}</td>
				<td>£{element.rate}</td>
				<td>{`${minWindow} - ${maxWindow} hours`}</td>
				<td>{element.carrier}</td>
				<td role='button'>
					<span className="text-secondary" onClick={() => router.push(`${PATHS.SHIPMENTS}/${element.shipmentID}`)}>View in shipments</span>
				</td>
			</tr>
		);
	});

	return (
		<div className='py-5 booking-container'>
			<DataGrid rows={rows} headings={['Booking ID', 'Status', 'Price/Kg', 'Rate', 'Time Window', 'Carrier', '']} emptyContent={<Empty />} />
		</div>
	);
};

export default Bookings;
