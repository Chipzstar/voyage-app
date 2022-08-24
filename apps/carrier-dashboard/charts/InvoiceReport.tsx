import React, { useMemo, useState } from 'react';
import { createStyles, ScrollArea, Table } from '@mantine/core';
import { SAMPLE_INVOICES } from '../utils/constants';

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

const InvoiceReport = props => {
	const { classes, cx } = useStyles();
	const [scrolled, setScrolled] = useState(false);
	const rows = SAMPLE_INVOICES.map(element => (
		<tr key={element.invoiceId}>
			<td>{element.invoiceId}</td>
			<td>{element.loadId}</td>
			<td>{`£${(element.amountDue / 100).toFixed(2)}`}</td>
		</tr>
	));

	const totalInvoice = useMemo(() => {
		const total = SAMPLE_INVOICES.reduce((prev, curr) => prev + curr.amountDue, 0);
		return (total / 100).toFixed(2);
	}, []);

	return (
		<ScrollArea sx={{ height: 250 }} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
			<Table>
				<thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
					<tr>
						<th>Invoice</th>
						<th>Load</th>
						<th>Amount</th>
					</tr>
				</thead>
				<tbody>{rows}</tbody>
				<tfoot className={cx(classes.footer, { [classes.scrolled]: scrolled })}>
					<tr>
						<td colSpan={2}>Overview</td>
						<td>
							<span>£{totalInvoice}</span>
						</td>
					</tr>
				</tfoot>
			</Table>
		</ScrollArea>
	);
};

InvoiceReport.propTypes = {};

export default InvoiceReport;
