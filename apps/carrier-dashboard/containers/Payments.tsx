import React from 'react';
import DataGrid from '../components/DataGrid';
import { Empty } from '@voyage-app/shared-ui-components';
import { PATHS, SAMPLE_INVOICES } from '../utils/constants';
import moment from 'moment/moment';
import { sanitize } from '@voyage-app/shared-utils';
import { INVOICE_STATUS } from '../utils/types';
import { useRouter } from 'next/router'

const Payments = ({message}) => {
	const router = useRouter()
	const rows = SAMPLE_INVOICES.map((element, index) => {
		return (
			<tr key={index}>
				<td colSpan={1}>
					<span className='text-secondary font-semibold text-lg'>{element.invoiceId}</span>
				</td>
				<td colSpan={1}>
					<div className='flex flex-col flex-shrink'>
						<span>FTL</span>
					</div>
				</td>
				<td colSpan={1}>
					<div className='flex flex-col flex-shrink'>
						<span>10pm - 4pm</span>
					</div>
				</td>
				<td colSpan={1}>
					<div className='flex flex-col flex-shrink'>
						<span>{moment.unix(element.createdAt).format('MMM DD, YYYY')}</span>
					</div>
				</td>
				<td colSpan={1}>
					<div className='flex flex-col flex-shrink'>{element.status === INVOICE_STATUS.OVERDUE ? <span className='text-red-500'>Overdue 6 days</span> : <span>{moment.unix(element.dueDate).format('MMM DD, YYYY')}</span>}</div>
				</td>
				<td colSpan={1}>
					<div className='flex flex-col flex-shrink'>
						<span className="capitalize">{sanitize(element.status)}</span>
					</div>
				</td>
				<td colSpan={1}>
					<div className='flex flex-col flex-shrink'>
						<span>£{(element.amountDue / 100).toFixed(2)}</span>
					</div>
				</td>
				<td role='button' colSpan={2}>
					<button className='bg-transparent flex grow hover:underline' onClick={() => router.push(`${PATHS.INVOICES}/${element.invoiceId}`)}>
						<span className='text-secondary font-semibold text-lg'>Download</span>
					</button>
				</td>
			</tr>
		);
	});
	return (
		<div>
			<DataGrid rows={rows} headings={['Invoice ID', 'Work Type', 'Work Period', 'Invoice Date', 'Payment Date', 'Status', 'Amount', '']} emptyContent={<Empty message={message} />} />
		</div>
	)
}

export default Payments
