import React, { useState } from 'react';
import { Tabs } from '@mantine/core';
import CarrierPreferences from '../../containers/CarrierPreferences';
import Locations from '../../containers/Locations';
import { useRouter } from 'next/router';
import { PATHS, PUBLIC_PATHS } from '../../utils/constants';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import moment from 'moment';
import getStore from '../../store';
import prisma from '../../db';
import { setLocations } from '../../store/features/locationSlice';
import { getToken } from 'next-auth/jwt';
import { fetchLocations } from '../../utils/functions';

export async function getServerSideProps({req, res}){
	// @ts-ignore
	const session = await unstable_getServerSession(req, res, authOptions)
	const token = await getToken({req})
	const store = getStore();
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
			initialState: store.getState()
		},
	};
}

const workflows = ({initialState}) => {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<string | null>('workflows');

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
						<Locations locations={initialState.locations}/>
					</Tabs.Panel>
				</Tabs>
			</div>
		</div>
	);
};

export default workflows;
