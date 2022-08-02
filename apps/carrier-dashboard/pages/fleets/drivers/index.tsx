import React from 'react';
import ContentContainer from '../../../layout/ContentContainer';
import { Switch, TextInput } from '@mantine/core'
import { Search } from 'tabler-icons-react';
import { PATHS, SAMPLE_DRIVERS } from '../../../utils/constants';
import { useRouter } from 'next/router';
import DataGrid from '../../../components/DataGrid';
import { Empty } from '@voyage-app/shared-ui-components'


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
				<td className="space-x-8" colSpan={2}>
					<button className='bg-transparent hover:underline text-sm' onClick={() => router.push(`${PATHS.DRIVERS}/${element.driverId}`)}>
						<span className='text-secondary font-semibold'>Update</span>
					</button>
					<button className='bg-transparent hover:underline text-sm' onClick={() => router.push(`${PATHS.DRIVERS}/${element.driverId}`)}>
						<span className='text-red-500 font-semibold'>Deactivate</span>
					</button>
				</td>
			</tr>
		);
	});
	return (
		<ContentContainer classNames='py-4 px-8 h-screen'>
			<div className='flex justify-between items-center mt-2 mb-6'>
				<TextInput className='w-96' size="md" radius={0} icon={<Search size={18} />} placeholder='Search for name, email or phone' />
				<button className='voyage-button' onClick={() => router.push(PATHS.NEW_DRIVER)}>
					<span className='text-base'>Add Driver</span>
				</button>
			</div>
			<DataGrid
				rows={rows}
				spacingY='md'
				headings={['Driver Name', 'Email', 'Phone', 'City', 'Postcode', 'Status', 'Actions']}
				emptyContent={<Empty message={<span className="text-center text-2xl">You have no drivers<br/>Click the 'Add Driver' button to add one</span>}/>} />
		</ContentContainer>
	);
};

export default drivers;
