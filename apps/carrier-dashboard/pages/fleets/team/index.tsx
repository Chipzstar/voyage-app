import React from 'react';
import { Switch, TextInput } from '@mantine/core';
import { Empty } from '@voyage-app/shared-ui-components';
import { Search } from 'tabler-icons-react';
import { PATHS, SAMPLE_TEAM } from '../../../utils/constants';
import DataGrid from '../../../components/DataGrid';
import Container from '../../../layout/Container';
import { useRouter } from 'next/router';

const team = () => {
	const router = useRouter();
	const rows = SAMPLE_TEAM.map((element, index) => {
		return (
			<tr key={index}>
				<td colSpan={1}>
					<span>{element.firstname}</span>
				</td>
				<td colSpan={1}>
					<span>{element.lastname}</span>
				</td>
				<td colSpan={1}>
					<span className='text-base font-normal'>{element.email}</span>
				</td>
				<td colSpan={1}>
					<span>{element.phone}</span>
				</td>
				<td colSpan={1}>
					<div className='flex flex-col flex-shrink'>
						<span className='capitalize'>{element.role}</span>
					</div>
				</td>
				<td colSpan={1}>
					<div className='flex flex-col flex-shrink'>
						<Switch checked={element.isActive} />
					</div>
				</td>
				<td className='space-x-4' colSpan={2}>
					<button className='bg-transparent hover:underline text-sm' onClick={() => router.push(`${PATHS.TEAM}/${element.memberId}`)}>
						<span className='text-secondary font-semibold'>Update</span>
					</button>
					<button className='bg-transparent hover:underline text-sm' onClick={() => router.push(`${PATHS.TEAM}/${element.memberId}`)}>
						<span className='text-red-500 font-semibold'>Deactivate</span>
					</button>
				</td>
			</tr>
		);
	});
	return (
		<Container classNames='py-4 px-8 min-h-screen'>
			<div className='flex justify-between items-center mt-2 mb-6'>
				<TextInput className='w-96' radius={0} icon={<Search size={18} />} placeholder='Search for name, email or phone' size="md"/>
				<button className='voyage-button' onClick={() => router.push(PATHS.NEW_DRIVER).then(() => console.log('navigating to booking page...'))}>
					<span className='text-base'>Add member</span>
				</button>
			</div>
			<DataGrid
				rows={rows}
				headings={['First Name', 'Last Name', 'Email', 'Phone', 'Role', 'Status', 'Actions']}
				emptyContent={<Empty message={`You have no drivers\nClick the 'Add Driver' button to add your first driver`}/>}
				spacingY='md'
			/>
		</Container>
	);
};

export default team
