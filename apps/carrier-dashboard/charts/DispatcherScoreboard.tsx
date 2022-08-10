import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { createStyles, ScrollArea, Table } from '@mantine/core';
import { useSelector } from 'react-redux';
import { useCustomers } from '../store/feature/customerSlice';

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

const DispatcherScoreboard = props => {
	const { classes, cx } = useStyles();
	const customers = useSelector(useCustomers)
	const [scrolled, setScrolled] = useState(false);
	const rows = customers.map((element, index) => (
		<tr key={index}>
			<td className='flex items-center'>
				<div className='p-2 bg-voyage-grey h-2 w-2'>
					<span>{index + 1}</span>
				</div>
				<span>
					{element.fullName}
				</span>
			</td>
			<td>
				<span>100</span>
			</td>
			<td>
				<span>£2000</span>
			</td>
			<td>
				<span>£500</span>
			</td>
		</tr>
	));
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
