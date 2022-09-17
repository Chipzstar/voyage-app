import React from 'react';
import { MantineNumberSize, Pagination, Table } from '@mantine/core';
import EmptyTable from './EmptyTable';
import { useTable, useWindowSize } from '@voyage-app/shared-ui-hooks';

export interface DataGridProps {
	rows: JSX.Element[];
	activePage: number;
	setPage: (page: number) => void;
	headings: string[];
	emptyContent: JSX.Element;
	spacingY?: MantineNumberSize;
	offset?: number;
	rowHeight?: number;
}

const DataGrid = ({ activePage, setPage, rows, headings = [], emptyContent, offset=0, rowHeight=100 }: DataGridProps) => {
	const { height: windowHeight } = useWindowSize();
	const { slice, range } = useTable(rows, activePage, windowHeight - offset, rowHeight);
	return rows?.length ? (
		<div className='flex flex-col justify-between'>
			<Table verticalSpacing='sm' fontSize='md'>
				<thead>
					<tr>
						{headings?.map((name, index) => (
							<th key={index}>{name}</th>
						))}
					</tr>
				</thead>
				<tbody>{slice}</tbody>
			</Table>
			<Pagination page={activePage} onChange={setPage} total={range.length} position='left' />
		</div>
	) : (
		<EmptyTable content={emptyContent} />
	);
};

export default DataGrid;
