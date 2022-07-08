import React from 'react';
import DataGrid from '../components/DataGrid';
import { SAMPLE_QUOTES } from '../utils';
import { ChevronDown } from 'tabler-icons-react';

const Quotes = () => {
	const rows = SAMPLE_QUOTES.map(element => (
		<tr key={element.quoteID}>
			<td>{element.quoteID}</td>
			<td>{element.quantity}</td>
			<td>{element.price}</td>
			<td>{element.rate}</td>
			<td>{element.timeWindow}</td>
			<td>{element.carrier}</td>
			<td role="button">
				<ChevronDown size={32} strokeWidth={1} color={'black'} />
			</td>
		</tr>
	));

	return (
		<div className='py-5 booking-container'>
			<DataGrid rows={rows} headings={['Quote ID', 'No. of quotes', 'Price/Kg', 'Rate', 'Time Window', 'Carrier', 'Action']} />
		</div>
	);
};

export default Quotes;
