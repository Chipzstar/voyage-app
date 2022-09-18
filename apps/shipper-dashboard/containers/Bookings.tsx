import React, { useState } from 'react';
import DataGrid from '../components/DataGrid';
import { PATHS } from '../utils/constants';
import { useRouter } from 'next/router';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { Booking } from '../utils/types';
import { Shipment } from '@voyage-app/shared-types';
import { useBooking } from '../store/features/bookingsSlice';
import { useShipments } from '../store/features/shipmentSlice';

const Empty = ({shipper}) => {
	const router = useRouter();
	return (
		<div className='flex h-full grow flex-col items-center justify-center space-y-8'>
			<h3 className='text-5xl font-light'>Welcome to Voyage!</h3>
			<p className='text-xl'>Your middle mile shipping partner optimizing your shipments.</p>
			<button className='voyage-button' onClick={() => router.push(PATHS.CREATE_BOOKING)}>
				Make a new booking
			</button>
		</div>
	);
};

const Bookings = ({ shipperInfo }) => {
	const router = useRouter();
	const bookings = useSelector(useBooking);
	const shipments = useSelector(useShipments);
	const [activePage, setPage] = useState(1);

	const rows = bookings
		.map((element: Booking) => (
			<tr key={element.id}>
				<td>{element.bookingId}</td>
				<td>{element.status}</td>
				<td>-</td>
				<td>-</td>
				<td>-</td>
				<td role='button'>
					<span className='text-secondary' onClick={() => router.push(`${PATHS.CREATE_BOOKING}/?bookingId=${element.bookingId}`)}>
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
						<td>{element.shipmentId}</td>
						<td>{element.bookingStatus}</td>
						<td>£{element.rate}</td>
						{[minWindow, maxWindow].includes(NaN) ? <td>Estimating</td> : <td>{`${minWindow} - ${maxWindow} hours`}</td>}
						<td>{element.carrierInfo?.name || '-'}</td>
						<td role='button'>
							<span className='text-secondary' onClick={() => router.push(`${PATHS.SHIPMENTS}/${element.shipmentId}`)}>
								View in shipments
							</span>
						</td>
					</tr>
				);
			})
		);

	return (
		<div className='flex grow flex-col py-5'>
			<DataGrid activePage={activePage} setPage={setPage} rows={rows} headings={['Booking ID', 'Status', 'Rate', 'Time Window', 'Carrier', '']} emptyContent={<Empty shipper={shipperInfo}/>} rowHeight={60} />
		</div>
	);
};

export default Bookings;
