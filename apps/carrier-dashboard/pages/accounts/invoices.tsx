import React, { useState } from 'react';
import ContentContainer from '../../layout/ContentContainer';
import { useSelector } from 'react-redux';
import { setLoads, useLoads } from '../../store/features/loadSlice';
import { wrapper } from '../../store';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import { getToken } from 'next-auth/jwt';
import { PUBLIC_PATHS, SAMPLE_INVOICES } from '../../utils/constants';
import { fetchInvoices, fetchLoads } from '../../utils/functions';
import prisma from '../../db';
import DataGrid from '../../components/DataGrid';
import moment from 'moment';
import { sanitize } from '@voyage-app/shared-utils';
import { useRouter } from 'next/router';
import { CloudDownload } from 'tabler-icons-react';
import { ActionIcon, Group, Text } from '@mantine/core';
import { INVOICE_STATUS } from '@voyage-app/shared-types';
import { setInvoices } from '../../store/features/invoiceSlice';

const Empty = ({message}) => (
	<div className='flex h-full flex-col justify-center'>
		<span className='text-3xl font-semibold'>{message}</span>
	</div>
);

const invoices = () => {
	const router = useRouter();
	const loads = useSelector(useLoads);
	const [activePage, setPage] = useState(1);

	const rows = SAMPLE_INVOICES.map((element, index) => {
		return (
			<tr key={index}>
				<td colSpan={1}>
					<span className='text-secondary font-semibold text-lg'>{element.invoiceId}</span>
				</td>
				<td colSpan={1}>
					<div className='flex flex-col flex-shrink'>
						<span>{moment.unix(element.createdAt).format('MMM DD, YYYY')}</span>
					</div>
				</td>
				<td colSpan={1}>
					<div className='flex flex-col flex-shrink'>
						<span>£{(element.total / 100).toFixed(2)}</span>
					</div>
				</td>
				<td colSpan={1}>
					<div className='flex flex-col flex-shrink'>
						<span className="capitalize">{sanitize(element.status)}</span>
					</div>
				</td>
				<td colSpan={1}>
					<div className='flex flex-col flex-shrink'>{element.status === INVOICE_STATUS.OVERDUE ? <span className='text-red-500'>Overdue 6 days</span> : <span>{moment.unix(element.dueDate).format('MMM DD, YYYY')}</span>}</div>
				</td>
				<td colSpan={1}>
					<div className='flex flex-col flex-shrink'>
						<span>£{(element.items[0].amountDue / 100).toFixed(2)}</span>
					</div>
				</td>
				<td role='button' colSpan={2}>
					<Group spacing='md' position='left'>
						<ActionIcon size='md' onClick={() => alert("not working yet... 😜")}>
							<CloudDownload/>
						</ActionIcon>
					</Group>
				</td>
			</tr>
		);
	});

	return (
		<ContentContainer classNames='py-4 px-8 h-screen'>
			<section>
				<header className='mb-4 flex h-20 flex-row items-center justify-between py-3'>
					<h2 className='page-header'>Invoices</h2>
				</header>
				<DataGrid activePage={activePage} setPage={setPage} rows={rows} headings={['Invoice ID', 'Date Created', 'Total', 'Paid', 'Date Due', 'Balance Due', 'Download']} emptyContent={<Empty message="No Invoices Created" />}/>
			</section>
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
	store.dispatch(setInvoices(invoices))
	return {
		props: {
			session
		}
	};
});

export default invoices;
