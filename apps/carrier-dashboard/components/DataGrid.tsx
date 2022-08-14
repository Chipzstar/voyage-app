import React from 'react';
import PropTypes from 'prop-types';
import { MantineNumberSize, Pagination, Table } from '@mantine/core';
import EmptyTable from './EmptyTable';
import useTable from '../hooks/useTable';
import useWindowSize from '../hooks/useWindowSize';

export interface DataGridProps {
	rows: JSX.Element[];
	activePage: number;
	setPage: (page: number) => void;
	headings: string[];
	emptyContent: JSX.Element;
	spacingY?: MantineNumberSize;
}

const DataGrid = ({ rows, activePage, setPage, headings = [], emptyContent, spacingY = 'sm'}: DataGridProps) => {
	const { height: windowHeight } = useWindowSize();
	const { slice, range } = useTable(rows, activePage, windowHeight);
	return rows?.length ? (
		<div className="flex flex-col justify-between">
			<Table verticalSpacing={spacingY} fontSize='md'>
				<thead>
					<tr>
						{headings?.map((name, index) => (
							<th key={index}>{name}</th>
						))}
					</tr>
				</thead>
				<tbody>{slice}</tbody>
			</Table>
			<Pagination page={activePage} onChange={setPage} total={range.length} position="right"/>
		</div>
	) : (
		<EmptyTable content={emptyContent} />
	);
};

DataGrid.propTypes = {
	rows: PropTypes.array.isRequired,
	headings: PropTypes.array.isRequired
};

export default DataGrid
