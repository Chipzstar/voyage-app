import React, { useCallback, useState } from 'react';
import { TextInput } from '@mantine/core';
import { Search } from 'tabler-icons-react';
import DataGrid from '../components/DataGrid';
import classNames from 'classnames';
import { STATUS } from '@voyage-app/shared-types';
import moment from 'moment/moment';
import { PATHS } from '../utils/constants';
import { useRouter } from 'next/router';
import { capitalize, getPropByString } from '@voyage-app/shared-utils';
import { Empty } from '@voyage-app/shared-ui-components';
import ContentContainer from '../layout/ContentContainer';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { useLoads } from '../store/features/loadSlice';
import { Load } from '../utils/types';

interface TripsProps {
	statuses: STATUS[];
	message: JSX.Element;
}

const headings = [
	{label:'Trip ID', key: 'loadId'},
	{label: 'Status', key: 'status'},
	{label: 'Controller', key: 'carrierInfo.controllerId'},
	{label: 'Driver', key: 'driver.name'},
	{label: 'Last Updated', key: 'updatedAt'},
	{label: 'Source', key: 'customer.name'},
	{label:'Tracking', key: null}
] as const

// const tableKeys = ['loadId', 'status', 'controller', 'driver', 'updatedAt', 'customer', null] as const
type SortKey = typeof headings[number]['key']

function filterData(data: Load[], search: string) {
	const query = search.toLowerCase().trim();
	return data.filter(
		({ loadId, pickup: { postcode }, driver: { name: driverName }, customer: { company: customerName } }) =>
			loadId.contains(query.trim()) || driverName.contains(query.trim()) || customerName.contains(query.trim()) || postcode.contains(query.trim())
	);
}

function sortData(data: Load[], payload: { sortBy: SortKey | null; reversed: boolean; search: string }) {
	const { sortBy } = payload;
	if (!sortBy) return filterData(data, payload.search);

	return filterData(
		[...data].sort((a, b) => {
			if (sortBy === 'updatedAt') {
				return payload.reversed ? getPropByString(b, sortBy) - getPropByString(a, sortBy) : getPropByString(a, sortBy) - getPropByString(b, sortBy)
			}
			return payload.reversed ? getPropByString(b, sortBy).localeCompare(getPropByString(a, sortBy)) : getPropByString(a, sortBy).localeCompare(getPropByString(b, sortBy));
		}),
		payload.search
	);
}

const Trips = ({ statuses = Object.values(STATUS), message }: TripsProps) => {
	const router = useRouter();
	const loads = useSelector(useLoads);
	const [search, setSearch] = useState('');
	const [filteredLoads, setFilteredLoads] = useState([...loads]);
	const [sortBy, setSortBy] = useState<SortKey | null>(null);
	const [reverseSortDirection, setReverseSortDirection] = useState(false);
	const [activePage, setPage] = useState(1);

	/*useEffect(() => setFilteredLoads(loads), [loads]);*/

	const setSorting = (field: SortKey) => {
		const reversed = field === sortBy ? !reverseSortDirection : false;
		setReverseSortDirection(reversed);
		setSortBy(field);
		setFilteredLoads(sortData(loads, { sortBy: field, reversed, search }));
	};


	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.currentTarget;
		setSearch(value);
		setFilteredLoads(sortData(loads, { sortBy, reversed: reverseSortDirection, search: value }));
	};

	const debouncedSearch = useCallback(
		_.debounce((query: string) => {
			setFilteredLoads(prevState => (query.length >= 2 ? filterData(loads, query.trim()) : loads));
		}, 300),
		[loads]
	);

	const rows = filteredLoads
		.filter(element => statuses.includes(element.status))
		.map((element, index) => {
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
						<span className='text-secondary text-lg font-semibold'>{element.loadId}</span>
					</td>
					<td colSpan={1}>
						<div className={statusClass}>
							<span className='text-base font-normal'>{capitalize(element.status)}</span>
						</div>
					</td>
					<td colSpan={1}>
						<div className='flex flex-shrink flex-col'>
							<span>{element.carrierInfo.controllerName}</span>
						</div>
					</td>
					<td colSpan={1}>
						<div className='flex flex-shrink flex-col'>
							<span>{element.carrierInfo.driverName}</span>
						</div>
					</td>
					<td colSpan={1}>
						<div className='flex flex-shrink flex-col'>
							<span>{element.updatedAt ? moment.unix(element?.updatedAt).fromNow() : '-'}</span>
						</div>
					</td>
					<td colSpan={1}>
						<div className='flex flex-shrink flex-col'>
							<span>{element.source}</span>
						</div>
					</td>
					<td role='button' colSpan={2}>
						<button className='flex grow bg-transparent hover:underline' onClick={() => router.push(`${PATHS.TRIPS}/${element.loadId}`)}>
							<span className='text-secondary text-lg font-semibold'>View</span>
						</button>
					</td>
				</tr>
			);
		});

	return (
		<ContentContainer classNames='px-6 py-2'>
			<div className='mt-2 mb-6 flex items-center justify-between'>
				<TextInput className='w-96' radius={0} icon={<Search size={18} />} placeholder='Search by ID, postcode, driver, customer...' onChange={handleSearchChange} />
				<button className='voyage-button h-11' onClick={() => router.push(PATHS.BOOK).then(() => console.log('navigating to booking page...'))}>
					<span className='text-base'>
						<span className='text-lg'>+&nbsp;</span>New Load
					</span>
				</button>
			</div>
			<DataGrid
				offset={50}
				sortBy={sortBy}
				reversed={reverseSortDirection}
				onSort={setSorting}
				activePage={activePage}
				setPage={setPage}
				rows={rows}
				headings={headings.slice()}
				emptyContent={<Empty message={message} />}
			/>
		</ContentContainer>
	);
};

Trips.propTypes = {};

export default Trips;
