import React from 'react';
import PropTypes from 'prop-types';
import { SAMPLE_QUOTES } from '../utils';
import { Table } from '@mantine/core';
import { ChevronDown } from 'tabler-icons-react';

const DataGrid = props => {
	const rows = SAMPLE_QUOTES.map(element => (
		<tr key={element.quoteId}>
			<td>{element.quoteId}</td>
			<td>{element.quantity}</td>
			<td>{element.price}</td>
			<td>{element.rate}</td>
			<td>{element.carrier}</td>
			<td>
				<ChevronDown
					size={48}
					strokeWidth={1}
					color={'black'}
				/>
			</td>
		</tr>
	));

	return (
		<Table verticalSpacing="sm" fontSize="md">
			<thead>
				<tr>
					<th>QuoteId</th>
					<th>No. of quotes</th>
					<th>Price/Kg</th>
					<th>Rate</th>
					<th>Carrier</th>
					<th>Action</th>
				</tr>
			</thead>
			<tbody>{rows}</tbody>
		</Table>
	);
};

DataGrid.propTypes = {};

export default DataGrid;
