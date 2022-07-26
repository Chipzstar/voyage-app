import React from 'react';
import PropTypes from 'prop-types';
import { Table } from '@mantine/core';
import EmptyTable from './EmptyTable';

const DataGrid = ({ rows, headings = [], emptyContent }) => {
	return rows?.length ? (
		<Table verticalSpacing='sm' fontSize='md'>
			<thead>
			<tr>
				{headings?.map((name, index) => (
					<th key={index}>{name}</th>
				))}
			</tr>
			</thead>
			<tbody>{rows}</tbody>
		</Table>
	) : (
		<EmptyTable content={emptyContent} />
	);
};

DataGrid.propTypes = {
	rows: PropTypes.array.isRequired,
	headings: PropTypes.array.isRequired
};

export default DataGrid;
