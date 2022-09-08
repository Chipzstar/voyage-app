import React, { useMemo, useState } from 'react';
import { createStyles, ScrollArea, Table } from '@mantine/core';
import { Customer, Load } from '../utils/types';
import { DateRange } from '@voyage-app/shared-types';

const useStyles = createStyles(theme => ({
	header: {
		position: 'sticky',
		top: 0,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
		transition: 'box-shadow 150ms ease',

		'&::after': {
			content: '""',
			position: 'absolute',
			left: 0,
			right: 0,
			bottom: 0,
			borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]}`
		}
	},
	footer: {
		position: 'sticky',
		bottom: 0,
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
		transition: 'box-shadow 150ms ease',

		'&::after': {
			content: '""',
			position: 'absolute',
			left: 0,
			right: 0,
			top: 0,
			borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]}`
		}
	},

	scrolled: {
		boxShadow: theme.shadows.sm
	}
}));

interface DispatcherScoreboardProps {
	customers: Customer[],
	loads: Load[]
	dateRange: DateRange
}

const DispatcherScoreboard = ({ loads, customers, dateRange } : DispatcherScoreboardProps) => {
	const { classes, cx } = useStyles();
	const [scrolled, setScrolled] = useState(false);
	
	const rows = useMemo(() => customers.map((c, index) => {
		let customerId = c.id
		const numLoads = loads.filter(load => load.customer.id === customerId).length
		const totalRev = loads.reduce((prev, curr) => curr.customer.id === customerId ? prev + curr.rate : prev, 0)
		const avgRRM = (totalRev / 30)
		return (
			<tr key={index}>
				<td className='flex items-center'>
					<div className='p-2 bg-voyage-grey h-2 w-2'>
						<span>{index + 1}</span>
					</div>
					<span>{c.fullName}</span>
				</td>
				<td>
					<span>{numLoads}</span>
				</td>
				<td>
					<span>${totalRev.toFixed(2)}</span>
				</td>
				<td>
					<span>£{avgRRM.toFixed(2)}</span>
				</td>
			</tr>
		);
	}), [loads, customers]);

	return (
		<ScrollArea sx={{ height: 250 }} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
			<Table verticalSpacing={8}>
				<thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
					<tr>
						<th>Ranking</th>
						<th>No. of loads</th>
						<th>Total Revenue</th>
						<th>Avg RPM</th>
					</tr>
				</thead>
				<tbody>{rows}</tbody>
			</Table>
		</ScrollArea>
	);
};

DispatcherScoreboard.propTypes = {}

export default DispatcherScoreboard
