import React from 'react'
import { PATHS } from '../../../utils/constants'
import { useRouter } from 'next/router';
import ContentContainer from '../../../layout/ContentContainer'
import { TextInput } from '@mantine/core'
import { Search } from 'tabler-icons-react'
import DataGrid from '../../../components/DataGrid'
import { Empty } from '@voyage-app/shared-ui-components'
import { sanitize } from '@voyage-app/shared-utils'
import { useSelector } from 'react-redux'
import { useCustomers } from '../../../store/feature/customerSlice'

const customers = () => {
	const router = useRouter();
	const customers = useSelector(useCustomers)
	const rows = customers.map((element, index) => {
		return (
			<tr key={index}>
				<td colSpan={1}>
					<span>{element.companyName}</span>
				</td>
				<td colSpan={1}>
					<span>{element.fullName}</span>
				</td>
				<td colSpan={1} className="w-64">
					<div className='flex flex-col flex-shrink flex-wrap'>
						<span>{element.addressLine1} {element.addressLine2}</span>
						<span>{element.postcode}</span>
					</div>
				</td>
				<td colSpan={1}>
					<span className='text-base font-normal'>{element.email}</span>
				</td>
				<td colSpan={1}>
					<span className="capitalize">{sanitize(element.accountType)}</span>
				</td>
				<td className='space-x-8' colSpan={2}>
					<button className='bg-transparent hover:underline text-sm' onClick={() => router.push(`${PATHS.CUSTOMERS}/${element.customerId}`)}>
						<span className='text-secondary font-semibold'>View More</span>
					</button>
				</td>
			</tr>
		);
	});
	return (
		<ContentContainer classNames='py-4 px-8 min-h-screen'>
			<div className='flex justify-between items-center mt-2 mb-6'>
				<TextInput className='w-96' radius={0} icon={<Search size={18} />} placeholder='Search for name, email or phone' size="md"/>
				<button className='voyage-button' onClick={() => router.push(PATHS.NEW_ACCOUNT)}>
					<span className='text-base'>New Account</span>
				</button>
			</div>
			<DataGrid
				rows={rows}
				headings={['Account Name', 'POC', 'Address', 'Contact Email', 'Account Type', 'Details']}
				emptyContent={<Empty message={<span className="text-center text-2xl">You have no team members<br/>Click the 'Add Member' button to add a new member</span>}/>}
				spacingY='md'
			/>
		</ContentContainer>
	);
};

export default customers
