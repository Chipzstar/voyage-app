import React from 'react';
import PropTypes from 'prop-types';
import { MantineNumberSize, Table } from '@mantine/core'
import EmptyTable from './EmptyTable';

export interface DataGridProps {
	rows: JSX.Element[],
	headings: string[]
	emptyContent: JSX.Element,
	spacingY?: MantineNumberSize
}

const DataGrid = ({ rows, headings = [], emptyContent, spacingY="sm" }: DataGridProps) => {
	return rows?.length ? (
		<Table verticalSpacing={spacingY} fontSize='md'>
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
