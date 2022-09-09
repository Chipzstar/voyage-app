import React from 'react';
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
	offset?: number;
	paginationPadding?: string
}

const DataGrid = ({ rows, activePage, setPage, headings = [], emptyContent, spacingY = 'sm', offset =0, paginationPadding=""}: DataGridProps) => {
	const { height: windowHeight } = useWindowSize();
	const { slice, range } = useTable(rows, activePage, windowHeight - offset);
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
			<div className={paginationPadding}>
				<Pagination page={activePage} onChange={setPage} total={range.length} position="right" />
			</div>
		</div>
	) : (
		<EmptyTable content={emptyContent} />
	);
};

export default DataGrid
