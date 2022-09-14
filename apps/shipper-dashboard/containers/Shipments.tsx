import React, { useState } from 'react';
import { Shipment, STATUS } from '@voyage-app/shared-types';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import { capitalize, sanitize } from '@voyage-app/shared-utils';
import moment from 'moment/moment';
import { PATHS } from '../utils/constants';
import DataGrid from '../components/DataGrid';

const Empty = ({ message }) => (
	<div className='mx-auto my-auto'>
		<span className='text-3xl my-auto mx-auto'>{message}</span>
	</div>
);

interface TripsProps {
	shipments: Shipment[];
	statuses: STATUS[];
	message: String;
}

const Shipments = ({ shipments, statuses = Object.values(STATUS), message }: TripsProps) => {
	const router = useRouter();
	const [activePage, setPage] = useState(1);

	const rows = shipments
		.filter(element => statuses.includes(element.status))
		.map((element, index) => {
			const statusClass = classNames({
				'py-1.5': true,
				'w-28': true,
				rounded: true,
				'text-center': true,
				capitalize: true,
				'text-white': true,
				'text-lg': true,
				'bg-new': element.status === STATUS.NEW,
				'bg-pending-400': element.status === STATUS.PENDING,
				'bg-dispatched-400': element.status === STATUS.DISPATCHED,
				'bg-en-route-400': element.status === STATUS.EN_ROUTE,
				'bg-completed-300': element.status === STATUS.COMPLETED,
				'bg-cancelled-300': element.status === STATUS.CANCELLED
			});
			return (
				<tr key={index}>
					<td colSpan={1}>
						<span className='text-secondary font-semibold text-lg'>{element.shipmentId}</span>
					</td>
					<td colSpan={1}>
						<div className={statusClass}>
							<span>{capitalize(sanitize(element.status))}</span>
						</div>
					</td>
					<td colSpan={1}>
						<div className='flex flex-col flex-shrink'>
							<span>{element.pickup.facilityName}</span>
							<span>{element.pickup.location}</span>
							<span>
								{moment.unix(element.pickup.window.start).format('HH:mm')} - {moment.unix(element.pickup.window.end).format('HH:mm DD MMM')}
							</span>
						</div>
					</td>
					<td colSpan={1}>
						<div className='flex flex-col flex-shrink'>
							<span>{element.delivery.facilityName}</span>
							<span>{element.delivery.location}</span>
							{element.delivery.window ? (
								<span>
									{moment.unix(element.delivery?.window?.start).format('HH:mm')} - {moment.unix(element.delivery?.window?.end).format('HH:mm DD MMM')}
								</span>
							) : (
								<span>Estimating delivery window...</span>
							)}
						</div>
					</td>
					<td role='button' colSpan={2}>
						<button className='bg-transparent flex grow hover:underline' onClick={() => router.push(`${PATHS.SHIPMENTS}/${element.shipmentId}`)}>
							<span className='text-secondary font-semibold text-lg'>View</span>
						</button>
					</td>
				</tr>
			);
		});

	return <DataGrid rows={rows} headings={['Shipment ID', 'Status', 'Pickup', 'Delivery', '']} emptyContent={<Empty message={message} />} activePage={activePage} setPage={setPage} offset={200}/>;
};

export default Shipments;
