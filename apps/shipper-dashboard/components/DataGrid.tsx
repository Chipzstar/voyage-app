import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Table } from '@mantine/core';
import { ChevronDown } from 'tabler-icons-react';
import EmptyTable from './EmptyTable';

const DataGrid = ({ rows, headings=[] }) => {

	return rows?.length ? (
		<Table verticalSpacing='sm' fontSize='md'>
			<thead>
				<tr>
					{headings?.map((name, index) => <th key={index}>{name}</th>)}
				</tr>
			</thead>
			<tbody>{rows}</tbody>
		</Table>
	) : (
		<EmptyTable />
	);
};

DataGrid.propTypes = {
	rows: PropTypes.array.isRequired,
	headings: PropTypes.array.isRequired
};

export default DataGrid;
