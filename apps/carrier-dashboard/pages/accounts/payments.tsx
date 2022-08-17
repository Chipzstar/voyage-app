import React, { useMemo } from 'react';
import ContentContainer from '../../layout/ContentContainer';
import { useSelector } from 'react-redux';
import { setLoads, useLoads } from '../../store/feature/loadSlice'
import { STATUS } from '@voyage-app/shared-types';
import { Load } from 'apps/carrier-dashboard/utils/types';
import { wrapper } from '../../store'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]'
import { getToken } from 'next-auth/jwt'
import { PUBLIC_PATHS } from '../../utils/constants'
import { fetchLoads } from '../../utils/functions'
import prisma from '../../db'

const payments = () => {
	const loads = useSelector(useLoads);

	const totalBalance = useMemo(() => {
		const total = loads.reduce((prev: number, curr: Load) => {
			return curr.status === STATUS.COMPLETED ? prev + curr.rate : prev;
		}, 0);
		return Number(total).toFixed(2);
	}, [loads]);

	return (
		<ContentContainer classNames='py-4 px-8 h-screen'>
			<div className='px-4 grid grid-cols-2 gap-8 h-full'>
				<section>
					<header className='flex flex-row items-center justify-between mb-8 py-3 h-20'>
						<h2 className='page-header'>Billing</h2>
					</header>
					<div className='border border-2 border-gray-300 py-8 px-4 flex flex-col justify-center space-y-4 w-96 lg:w-128'>
						<span className='uppercase text-xl'>Total Balance Due</span>
						<span className='text-4xl font-bold text-secondary'>£{totalBalance}</span>
						<span className='text-red-500 text-lg'>Overdue Balance: £0</span>
					</div>
				</section>
				<section>
					<header className='flex flex-row items-center justify-between mb-8 py-3 h-20'>
						<h2 className='page-header'>Invoices</h2>
					</header>
					<div className='flex flex-col justify-center'>
						<span className='text-3xl font-semibold'>No Invoices Created</span>
					</div>
				</section>
			</div>
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
	return {
		props: {
			session
		}
	}
})

export default payments
