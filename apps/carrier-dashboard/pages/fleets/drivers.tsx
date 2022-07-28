import React from 'react';
import Container from '../../layout/Container';
import { Switch, TextInput } from '@mantine/core'
import { Search } from 'tabler-icons-react';
import { PATHS, SAMPLE_DRIVERS } from '../../utils/constants';
import { useRouter } from 'next/router';
import DataGrid from '../../components/DataGrid';

const Empty = ({ message }) => (
	<div className='mx-auto my-auto'>
		<span className='text-center text-3xl my-auto mx-auto'>{message}</span>
	</div>
);

const drivers = () => {
	const router = useRouter();
	const rows = SAMPLE_DRIVERS.map((element, index) => {
		return (
			<tr key={index}>
				<td colSpan={1}>
					<span>
						{element.firstname} {element.lastname}
					</span>
				</td>
				<td colSpan={1}>
					<span className='text-base font-normal'>{element.email}</span>
				</td>
				<td colSpan={1}>
					<span>{element.defaultPhone}</span>
				</td>
				<td colSpan={1}>
					<div className='flex flex-col flex-shrink'>
						<span>{element.city}</span>
					</div>
				</td>
				<td colSpan={1}>
					<div className='flex flex-col flex-shrink'>
						<span>{element.postcode}</span>
					</div>
				</td>
				<td colSpan={1}>
					<div className='flex flex-col flex-shrink'>
						<Switch
							checked={element.isActive}
						/>
					</div>
				</td>
				<td role='button' className="flex space-x-3" colSpan={2}>
					<button className='bg-transparent flex grow hover:underline' onClick={() => router.push(`${PATHS.DRIVERS}/${element.driverId}`)}>
						<span className='text-secondary font-semibold text-lg'>View</span>
					</button>
					<button className='bg-transparent flex grow hover:underline' onClick={() => router.push(`${PATHS.DRIVERS}/${element.driverId}`)}>
						<span className='text-red-500 font-semibold text-lg'>Deactivate</span>
					</button>
				</td>
			</tr>
		);
	});
	return (
		<Container classNames='py-4 px-8 min-h-screen'>
			<div className='flex justify-between items-center mt-2 mb-6'>
				<TextInput className='w-96' radius={0} icon={<Search size={18} />} placeholder='Search for name, email or phone' />
				<button className='voyage-button' onClick={() => router.push(PATHS.BOOK).then(() => console.log('navigating to booking page...'))}>
					<span className='text-base'>Add Driver</span>
				</button>
			</div>
			<DataGrid rows={rows} headings={['Driver Name', 'Email', 'Phone', 'City', 'Postcode', 'Status', '']} emptyContent={<Empty message={`You have no drivers\nClick the 'Add Driver' button to add your first driver`} />} />
		</Container>
	);
};

export default drivers;
