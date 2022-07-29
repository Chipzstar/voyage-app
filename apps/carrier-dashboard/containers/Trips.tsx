import React from 'react';
import { TextInput } from '@mantine/core';
import { Search } from 'tabler-icons-react';
import DataGrid from '../components/DataGrid';
import classNames from 'classnames';
import { STATUS } from '@voyage-app/shared-types';
import moment from 'moment/moment';
import { PATHS, SAMPLE_LOADS } from '../utils/constants';
import { useRouter } from 'next/router';
// @ts-ignore
import { capitalize } from '@voyage-app/shared-utils';
import { Empty } from '@voyage-app/shared-ui-components';

interface TripsProps {
	statuses: STATUS[],
	message: JSX.Element
}

const Trips = ({ statuses = Object.values(STATUS), message }: TripsProps) => {
	const router = useRouter();
	const rows = SAMPLE_LOADS.filter(element => statuses.includes(element.status)).map((element, index) => {
		const statusClass = classNames({
			'my-2': true,
			'py-1': true,
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
						<span className='text-base font-normal'>{capitalize(element.status)}</span>
					</div>
				</td>
				<td colSpan={1}>
					<div className='flex flex-col flex-shrink'>
						<span>{element.controller.name}</span>
					</div>
				</td>
				<td colSpan={1}>
					<div className='flex flex-col flex-shrink'>
						<span>{element.carrier.driverName}</span>
					</div>
				</td>
				<td colSpan={1}>
					<div className='flex flex-col flex-shrink'>
						<span>{element.updatedAt ? moment.unix(element?.updatedAt).fromNow() : '-'}</span>
					</div>
				</td>
				<td colSpan={1}>
					<div className='flex flex-col flex-shrink'>
						<span>{element.source}</span>
					</div>
				</td>
				<td role='button' colSpan={2}>
					<button className='bg-transparent flex grow hover:underline' onClick={() => router.push(`${PATHS.TRIPS}/${element.shipmentId}`)}>
						<span className='text-secondary font-semibold text-lg'>View</span>
					</button>
				</td>
			</tr>
		);
	});
	return (
		<div className='container px-6'>
			<div className='flex justify-between items-center mt-2 mb-6'>
				<TextInput className='w-96' radius={0} icon={<Search size={18} />} placeholder='Search by ID, location, driver..' />
				<button className='voyage-button' onClick={() => router.push(PATHS.BOOK).then(() => console.log("navigating to booking page..."))}>
					<span className='text-base'>
						<span className='text-lg'>+&nbsp;</span>New Load
					</span>
				</button>
			</div>
			<DataGrid rows={rows} headings={['Shipment ID', 'Status', 'Controller', 'Driver', 'Last Updated', 'Source', 'Tracking']} emptyContent={<Empty message={message} />} />
		</div>
	);
};

Trips.propTypes = {}

export default Trips
