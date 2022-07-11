import React from 'react';
import DataGrid from '../components/DataGrid';
import { PATHS, SAMPLE_QUOTES } from '../utils';
import { ChevronDown } from 'tabler-icons-react';
import { useRouter } from 'next/router';

const Empty = () => {
	const router = useRouter();
	return (
		<div className='space-y-8 h-full flex flex-col grow justify-center items-center'>
			<h3 className='text-5xl font-light'>Welcome to Voyage!</h3>
			<p className='text-xl'>Your middle mile shipping partner optimizing your shipments.</p>
			<button className='voyage-button' onClick={() => router.push(PATHS.CREATE_BOOKING)}>
				Get a new quote
			</button>
		</div>
	);
};

const Quotes = () => {
	const rows = SAMPLE_QUOTES.map(element => (
		<tr key={element.quoteID}>
			<td>{element.quoteID}</td>
			<td>{element.quantity}</td>
			<td>{element.price}</td>
			<td>{element.rate}</td>
			<td>{element.timeWindow}</td>
			<td>{element.carrier}</td>
			<td role='button'>
				<ChevronDown size={32} strokeWidth={1} color={'black'} />
			</td>
		</tr>
	));

	return (
		<div className='py-5 booking-container'>
			<DataGrid rows={rows} headings={['Quote ID', 'No. of quotes', 'Price/Kg', 'Rate', 'Time Window', 'Carrier', 'Action']} emptyContent={<Empty />} />
		</div>
	);
};

export default Quotes;
