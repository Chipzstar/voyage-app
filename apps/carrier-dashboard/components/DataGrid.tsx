import React from 'react';
import { Center, createStyles, Group, MantineNumberSize, Pagination, Table, Text, UnstyledButton } from '@mantine/core';
import EmptyTable from './EmptyTable';
import { useTable, useWindowSize } from '@voyage-app/shared-ui-hooks';
import { ChevronDown, ChevronUp, Selector } from 'tabler-icons-react';
import { TableHeadings } from '@voyage-app/shared-types';

interface ThProps {
	children: React.ReactNode;
	reversed: boolean;
	sorted: boolean;

	onSort(): void;
}

const useStyles = createStyles(theme => ({
	th: {
		padding: '0 !important'
	},

	control: {
		width: '100%',
		padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,

		'&:hover': {
			backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0]
		}
	},

	icon: {
		width: 21,
		height: 21,
		borderRadius: 21
	}
}));

function Th({ children, reversed, sorted, onSort }: ThProps) {
	const { classes } = useStyles();
	const Icon = sorted ? (reversed ? ChevronUp : ChevronDown) : Selector;
	return (
		<th className={classes.th}>
			<UnstyledButton onClick={onSort} className={classes.control}>
				<Group position='apart'>
					<Text color="dark" weight={500}>
						{children}
					</Text>
					<Center className={classes.icon}>
						<Icon size={14} />
					</Center>
				</Group>
			</UnstyledButton>
		</th>
	);
}

export interface DataGridProps {
	rows: JSX.Element[];
	activePage: number;
	setPage: (page: number) => void;
	headings: TableHeadings[];
	sortBy?: string;
	onSort?: (key: string) => void;
	reversed?: boolean;
	emptyContent: JSX.Element;
	spacingY?: MantineNumberSize;
	offset?: number;
	rowHeight?: number;
}

const DataGrid = ({ rows, activePage, setPage, sortBy, reversed, onSort, headings = [], emptyContent, spacingY = 'sm', offset = 0, rowHeight = 100 }: DataGridProps) => {
	const { height: windowHeight } = useWindowSize();
	const { slice, range } = useTable(rows, activePage, windowHeight - offset, rowHeight);
	return rows?.length ? (
		<div className='flex flex-col justify-between'>
			<Table verticalSpacing={spacingY} fontSize='md'>
				<thead>
					<tr>
						{headings?.map(({ key, label }, index) => {
							return key ? (
								<Th sorted={sortBy === key} reversed={reversed} onSort={() => onSort(key)}>
									{label}
								</Th>
							) : (
								<th key={index}>{label}</th>
							);
						})}
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
