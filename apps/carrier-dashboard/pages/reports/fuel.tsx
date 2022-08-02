import React, { useState } from 'react'
import PageContainer from '../../layout/PageContainer'
import { Table, Button } from '@mantine/core'
import NewFuelTransaction from '../../modals/NewFuelTransaction'

const fuel = () => {
	const [fuelCardForm, showFuelCardForm] = useState(false)
	const rows = []
	return (
		<PageContainer>
			<NewFuelTransaction opened={fuelCardForm} onClose={() => showFuelCardForm(false)}/>
			<header className='flex flex-wrap justify-between items-center mt-2 mb-6 px-5'>
				<h2 className='page-header'>Fuel Summary</h2>
				<Button variant='outline' className='w-auto px-4' onClick={() => showFuelCardForm(true)}>
					Add fuel card transaction
				</Button>
			</header>
			<Table>
				<thead>
					<th>Load ID</th>
					<th>Fuel Card</th>
					<th>Transaction Date</th>
					<th>Driver</th>
					<th>Unit</th>
					<th>City</th>
					<th>Product</th>
					<th>Qty</th>
					<th>Amount</th>
					<th>PPG</th>
				</thead>
				<tbody>{rows}</tbody>
			</Table>
		</PageContainer>
	)
}

export default fuel
