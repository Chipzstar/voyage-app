import TabBar from '../../layout/TabBar';
import { PUBLIC_PATHS, SETTINGS_TABS } from '../../utils/constants'
import React from 'react';
import { Container, Tabs } from '@mantine/core'
import Organisation from './containers/Organisation'
import Financial from './containers/Financial'
import { wrapper } from '../../store'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]'
import { getToken } from 'next-auth/jwt'
import { fetchProfile } from '../../utils/functions'
import prisma from '../../db'
import { setCarrier, useCarrier } from '../../store/feature/profileSlice'
import { useSelector } from 'react-redux';
import Documents from './containers/Documents';

const TAB_LABELS = {
	ORGANIZATION: SETTINGS_TABS[0].value,
	FINANCIAL: SETTINGS_TABS[1].value,
	DOCUMENTS: SETTINGS_TABS[2].value,
}

const settings = () => {
	const profile = useSelector(useCarrier)
	return (
		<Container fluid px={0} className="h-full">
			<TabBar tabLabels={SETTINGS_TABS} defaultTab={SETTINGS_TABS[0].value}>
				<Tabs.Panel value={TAB_LABELS.ORGANIZATION}>
					<Organisation carrierInfo={profile}/>
				</Tabs.Panel>
				<Tabs.Panel value={TAB_LABELS.FINANCIAL}>
					<Financial/>
				</Tabs.Panel>
				<Tabs.Panel value={TAB_LABELS.DOCUMENTS}>
					<Documents carrierInfo={profile}/>
				</Tabs.Panel>
			</TabBar>
		</Container>
	);
};

export const getServerSideProps = wrapper.getServerSideProps(store => async ({ req, res }) => {
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
	if (session.id || token?.carrierId) {
		let carrier = await fetchProfile(session.id, token?.carrierId, prisma);
		store.dispatch(setCarrier(carrier));
	}
	return {
		props: {
			session
		}
	};
});

export default settings;