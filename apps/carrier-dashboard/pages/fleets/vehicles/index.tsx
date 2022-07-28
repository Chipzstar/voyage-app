import React from 'react';
import { Switch, TextInput } from '@mantine/core';
import { Empty } from '@voyage-app/shared-ui-components';
import { Search } from 'tabler-icons-react';
import { PATHS, SAMPLE_VEHICLES } from '../../../utils/constants';
import DataGrid from '../../../components/DataGrid';
import Container from '../../../layout/Container';
import { useRouter } from 'next/router';

const vehicles = () => {
	const router = useRouter();
	const rows = SAMPLE_VEHICLES.map((element, index) => {
		return (
			<tr key={index}>
				<td colSpan={1}>
					<span>{element.vehicleId}</span>
				</td>
				<td colSpan={1}>
					<span>{element.make}</span>
				</td>
				<td colSpan={1}>
					<span>{element.model}</span>
				</td>
				<td colSpan={1}>
					<span className="capitalize">{element.status.replace(/-/g, ' ')}</span>
				</td>
				<td colSpan={1}>
					<div className='flex flex-col flex-shrink'>
						<span className="capitalize">Mo Farah</span>
					</div>
				</td>
				<td colSpan={1}>
					<div className='flex flex-col flex-shrink'>
						<span className="capitalize">{element.regNumber}</span>
					</div>
				</td>
				<td className='space-x-8' colSpan={2}>
					<button className='bg-transparent hover:underline text-sm' onClick={() => router.push(`${PATHS.TEAM}/${element.vehicleId}`)}>
						<span className='text-secondary font-semibold'>Update</span>
					</button>
				</td>
			</tr>
		);
	});
	return (
		<Container classNames='py-4 px-8 h-screen flex flex-col'>
			<div className='flex justify-between items-center mt-2 mb-6'>
				<TextInput className='w-96' radius={0} icon={<Search size={18} />} placeholder='Search for name, email or phone' size="md"/>
				<button className='voyage-button' onClick={() => router.push(PATHS.NEW_VEHICLE)}>
					<span className='text-base'>Add vehicle</span>
				</button>
			</div>
			<DataGrid
				rows={rows}
				headings={['ID', 'Make', 'Model', 'Status', 'Current Driver', 'Reg No.', 'Actions']}
				emptyContent={<Empty message={<span className="text-center text-2xl">You have no vehicles<br/>Click the 'Add Vehicle' button to add one</span>}/>}
				spacingY='md'
			/>
		</Container>
	);
};

export default vehicles
