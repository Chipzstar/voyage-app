import React, { useContext } from 'react';
import { Tabs } from '@mantine/core';
import CarrierPreferences from '../../containers/CarrierPreferences';
import Locations from '../../containers/Locations';
import { TabContext } from '../../context';
import { useRouter } from 'next/router';
import { PATHS } from '../../utils/constants';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import moment from 'moment';
import getStore from '../../store';
import prisma from '../../db';
import { setLocations } from '../../store/features/locationSlice';

export async function getServerSideProps({req, res}){
	// @ts-ignore
	const session = await unstable_getServerSession(req, res, authOptions)
	const store = getStore();
	let locations = await prisma.location.findMany({
		where: {
			userId: {
				equals: session.id
			}
		},
		orderBy: {
			createdAt: 'desc'
		}
	})
	locations = locations.map(location => ({
		...location,
		createdAt: moment(location.createdAt).unix(),
		updatedAt: moment(location.updatedAt).unix()
	}))
	store.dispatch(setLocations(locations))
	return {
		props: {
			initialState: store.getState()
		},
	};
}

const workflows = ({initialState}) => {
	const router = useRouter();
	const { index, dispatch } = useContext(TabContext)

	return (
		<div className='p-4 h-screen'>
			<div className='px-4 h-full'>
				<Tabs active={index} onTabChange={(value) => {
					router.push(PATHS.WORKFLOWS, `#${value}`, {shallow: true})
					dispatch({type: 'setIndex', index: value})
				}} grow>
					<Tabs.Tab label='Carrier Preferences' className='text-lg'>
						<CarrierPreferences />
					</Tabs.Tab>
					<Tabs.Tab label='Locations' className='text-lg'>
						<Locations locations={initialState.locations}/>
					</Tabs.Tab>
				</Tabs>
			</div>
		</div>
	);
};

export default workflows;
