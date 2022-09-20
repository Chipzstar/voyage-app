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
import { ActionIcon, Group } from '@mantine/core';
import { INVOICE_STATUS } from '@voyage-app/shared-types';
import { setInvoices, useInvoices } from '../../store/features/invoiceSlice';

const Empty = ({ message }) => (
	<div className='flex flex-col grow items-center justify-center'>
		<span className='text-3xl font-semibold'>{message}</span>
	</div>
);

const invoices = () => {
	const router = useRouter();
	const loads = useSelector(useLoads);
	const [activePage, setPage] = useState(1);
	const invoices = useSelector(useInvoices);

	useEffect(() => console.log(invoices), [invoices]);

	const rows = invoices.map((element, index) => {
		return (
			<tr key={index}>
				<td colSpan={1}>
					<span className='text-secondary text-lg font-semibold'>{element.invoiceId}</span>
				</td>
				<td colSpan={1}>
					<div className='flex flex-shrink flex-col'>
						<span>{moment.unix(element.createdAt).format('MMM DD, YYYY')}</span>
					</div>
				</td>
				<td colSpan={1}>
					<div className='flex flex-shrink flex-col'>
						<span>£{(element.total).toFixed(2)}</span>
					</div>
				</td>
				<td colSpan={1}>
					<div className='flex flex-shrink flex-col'>
						<span className='capitalize'>{sanitize(element.status)}</span>
					</div>
				</td>
				<td colSpan={1}>
					<div className='flex flex-shrink flex-col'>{element.status === INVOICE_STATUS.OVERDUE ? <span className='text-red-500'>Overdue 6 days</span> : <span>{moment.unix(element.dueDate).format('MMM DD, YYYY')}</span>}</div>
				</td>
				<td colSpan={1}>
					<div className='flex flex-shrink flex-col'>
						<span>£{(element.items[0].amountDue).toFixed(2)}</span>
					</div>
				</td>
				<td role='button' colSpan={2}>
					<Group spacing='md' position='left'>
						<ActionIcon size='md' onClick={() => alert('not working yet... 😜')}>
							<CloudDownload />
						</ActionIcon>
					</Group>
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
				headings={['Invoice ID', 'Date Created', 'Total', 'Paid', 'Date Due', 'Balance Due', 'Download']}
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
