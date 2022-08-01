import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { createStyles, ScrollArea, Table } from '@mantine/core'

const useStyles = createStyles((theme) => ({
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

const AvailableTrucks = props => {
	const { classes, cx } = useStyles();
	const [scrolled, setScrolled] = useState(false);
	return (
		<ScrollArea sx={{ height: 250 }} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
			<Table>
				<thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
				<tr>
					<th>Load ID</th>
					<th>BOL</th>
					<th>Original BOL</th>
					<th>Signed BOL</th>
					<th>Rate Confirmation</th>
				</tr>
				</thead>
			</Table>
		</ScrollArea>
	)
}

AvailableTrucks.propTypes = {
	
}

export default AvailableTrucks
