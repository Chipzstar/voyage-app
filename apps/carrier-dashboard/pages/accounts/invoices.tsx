import React, { useEffect, useState } from 'react';
import ContentContainer from '../../layout/ContentContainer';
import { useSelector } from 'react-redux';
import { setLoads, useLoads } from '../../store/features/loadSlice';
import { wrapper } from '../../store';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import { getToken } from 'next-auth/jwt';
import { PUBLIC_PATHS } from '../../utils/constants';
import { fetchInvoices, fetchLoads } from '../../utils/functions';
import prisma from '../../db';
import DataGrid from '../../components/DataGrid';
import moment from 'moment';
import { sanitize } from '@voyage-app/shared-utils';
import { useRouter } from 'next/router';
import { CloudDownload } from 'tabler-icons-react';
import { ActionIcon } from '@mantine/core';
import { INVOICE_STATUS } from '@voyage-app/shared-types';
import { setInvoices, useInvoices } from '../../store/features/invoiceSlice';

const Empty = ({ message }) => (
	<div className='flex grow flex-col items-center justify-center'>
		<span className='text-3xl font-semibold'>{message}</span>
	</div>
);

const invoices = () => {
	const router = useRouter();
	const loads = useSelector(useLoads);
	const [activePage, setPage] = useState(1);
	const invoices = useSelector(useInvoices);

	useEffect(() => console.log(invoices), [invoices]);

	const rows = invoices.map((invoice, index) => {
		return (
			<tr key={index}>
				<td colSpan={1}>
					<span className='text-secondary text-lg font-semibold'>{invoice.invoiceId}</span>
				</td>
				<td colSpan={1}>
					<div className='flex flex-shrink flex-col'>
						<span>{moment.unix(invoice.createdAt).format('MMM DD, YYYY')}</span>
					</div>
				</td>
				<td colSpan={1}>
					<div className='flex flex-shrink flex-col'>
						<span>£{invoice.items[0].amountDue.toFixed(2)}</span>
					</div>
				</td>
				<td colSpan={1}>
					<div className='flex flex-shrink flex-col'>
						<span className='capitalize'>{sanitize(invoice.status)}</span>
					</div>
				</td>
				<td colSpan={1}>
					<div className='flex flex-shrink flex-col'>{invoice.status === INVOICE_STATUS.OVERDUE ? <span className='text-red-500'>Overdue 6 days</span> : <span>{moment.unix(invoice.dueDate).format('MMM DD, YYYY')}</span>}</div>
				</td>
				<td colSpan={1}>
					<div className='flex flex-shrink flex-col'>
						<span>£{invoice.total.toFixed(2)}</span>
					</div>
				</td>
				<td role='button' colSpan={2}>
					<a href={invoice.pdfLocation} target='_blank' download>
						<ActionIcon size='md'>
							<CloudDownload />
						</ActionIcon>
					</a>
				</td>
			</tr>
		);
	});

	return (
		<ContentContainer classNames='py-4 px-8 h-screen flex flex-col'>
			<header className='mb-4 flex h-20 flex-row items-center justify-between py-3'>
				<h2 className='page-header'>Invoices</h2>
			</header>
			<DataGrid
				activePage={activePage}
				setPage={setPage}
				rows={rows}
				headings={[
					{ label: 'Invoice ID', key: null },
					{ label: 'Date Created', key: null },
					{
						label: 'Amount',
						key: null
					},
					{ label: 'Paid', key: null },
					{ label: 'Date Due', key: null },
					{
						label: 'Balance Due',
						key: null
					},
					{ label: 'Download', key: null }
				]}
				emptyContent={<Empty message='No Invoices Created' />}
			/>
		</ContentContainer>
	);
};

export const getServerSideProps = wrapper.getServerSideProps(store => async ({ req, res, params }) => {
	// @ts-ignore
	const session = await unstable_getServerSession(req, res, authOptions);
	const token = await getToken({ req });
	if (!session) {
		return {
			redirect: {
				destination: PUBLIC_PATHS.LOGIN,
				permanent: false
			}
		};
	}
	const loads = await fetchLoads(token?.carrierId, prisma);
	store.dispatch(setLoads(loads));
	const invoices = await fetchInvoices(token?.carrierId, prisma);
	store.dispatch(setInvoices(invoices));
	return {
		props: {
			session
		}
	};
});

export default invoices;
