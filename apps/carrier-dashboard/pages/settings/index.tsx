import prisma from '../../db';
import TabBar from '../../layout/TabBar';
import { PUBLIC_PATHS, SETTINGS_TABS } from '../../utils/constants';
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Container, Tabs } from '@mantine/core';
import Organisation from '../../containers/settings/Organisation';
import Financial from '../../containers/settings/Financial';
import Workflows from '../../containers/settings/Workflows';
import Documents from '../../containers/settings/Documents';
import { wrapper } from '../../store';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import { getToken } from 'next-auth/jwt';
import { fetchDocuments, fetchProfile, fetchSettings } from '../../utils/functions';
import { setCarrier, useCarrier } from '../../store/feature/profileSlice';
import { setSettings, useSettings } from '../../store/feature/settingsSlice';
import { ActivationStatus } from '../../utils/types';
import { setDocuments, useDocuments } from '../../store/feature/documentSlice';

const TAB_LABELS = {
	ORGANIZATION: SETTINGS_TABS[0].value,
	WORKFLOWS: SETTINGS_TABS[1].value,
	FINANCIAL: SETTINGS_TABS[2].value,
	DOCUMENTS: SETTINGS_TABS[3].value
};

const settings = () => {
	const profile = useSelector(useCarrier);
	const settings = useSelector(useSettings);
	const documents = useSelector(useDocuments);

	const defaultTab = useMemo(() => {
		return profile?.status !== ActivationStatus.COMPLETE ? profile.status : SETTINGS_TABS[0].value;
	}, [profile]);

	const [activeTab, setActiveTab] = useState<string | null>(defaultTab);

	return (
		<Container fluid px={0} className='h-full'>
			<TabBar tabLabels={SETTINGS_TABS} activeTab={activeTab} setActiveTab={setActiveTab} status={profile.status}>
				<Tabs.Panel value={TAB_LABELS.ORGANIZATION}>
					<Organisation carrierInfo={profile} nextTab={() => setActiveTab(ActivationStatus.WORKFLOWS)} />
				</Tabs.Panel>
				<Tabs.Panel value={TAB_LABELS.WORKFLOWS}>
					<Workflows carrierInfo={profile} settings={settings} nextTab={() => setActiveTab(ActivationStatus.BANK_ACCOUNT)} />
				</Tabs.Panel>
				<Tabs.Panel value={TAB_LABELS.FINANCIAL}>
					<Financial carrierInfo={profile} nextTab={() => setActiveTab(ActivationStatus.DOCUMENTS)}/>
				</Tabs.Panel>
				<Tabs.Panel value={TAB_LABELS.DOCUMENTS}>
					<Documents carrierInfo={profile} documents={documents} />
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
		let settings = await fetchSettings(token?.carrierId, prisma);
		let documents = await fetchDocuments(token?.carrierId, prisma)
		store.dispatch(setCarrier(carrier));
		store.dispatch(setSettings(settings));
		store.dispatch(setDocuments(documents))
	}
	return {
		props: {
			session
		}
	};
});

export default settings;
