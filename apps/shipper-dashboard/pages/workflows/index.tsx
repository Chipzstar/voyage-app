import React, { useState } from 'react';
import { Tabs } from '@mantine/core';
import CarrierPreferences from '../../containers/CarrierPreferences';
import Locations from '../../containers/Locations';
import { useRouter } from 'next/router';
import { PATHS, PUBLIC_PATHS } from '../../utils/constants';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import prisma from '../../db';
import { setLocations, useLocation } from '../../store/features/locationSlice';
import { getToken } from 'next-auth/jwt';
import { fetchLocations } from '../../utils/functions';
import { wrapper } from '../../store';
import { useSelector } from 'react-redux';

const workflows = () => {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<string | null>('workflows');
	const locations = useSelector(useLocation)

	return (
		<div className='p-4 h-screen'>
			<div className='px-4 h-full'>
				<Tabs value={activeTab} onTabChange={(value) => {
					router.push(PATHS.WORKFLOWS, `#${value}`, {shallow: true})
					setActiveTab(value)
				}}>
					<Tabs.List grow>
						<Tabs.Tab value="workflows">Carrier Preferences</Tabs.Tab>
						<Tabs.Tab value="locations">Locations</Tabs.Tab>
					</Tabs.List>
					<Tabs.Panel value='workflows'>
						<CarrierPreferences />
					</Tabs.Panel>
					<Tabs.Panel value='locations'>
						<Locations locations={locations}/>
					</Tabs.Panel>
				</Tabs>
			</div>
		</div>
	);
};

export const getServerSideProps = wrapper.getServerSideProps(store => async ({ req, res }) =>{
	// @ts-ignore
	const session = await unstable_getServerSession(req, res, authOptions)
	const token = await getToken({req})
	if (!session) {
		return {
			redirect: {
				destination: PUBLIC_PATHS.LOGIN,
				permanent: false
			}
		};
	}
	const locations = await fetchLocations(token?.shipperId, prisma)
	store.dispatch(setLocations(locations))
	return {
		props: {
			session
		}
	};
})

export default workflows;
