import TabBar from '../../layout/TabBar';
import { SETTINGS_TABS } from '../../utils/constants';
import React from 'react';
import { Container, Tabs } from '@mantine/core'
import Organisation from './containers/Organisation'
import Financial from './containers/Financial'

const TAB_LABELS = {
	ORGANIZATION: 'organisation',
	FINANCIAL: 'financial'
}

const settings = () => {
	return (
		<Container fluid px={0} className="h-full">
			<TabBar tabLabels={SETTINGS_TABS} defaultTab={SETTINGS_TABS[0].value}>
				<Tabs.Panel value={TAB_LABELS.ORGANIZATION}>
					<Organisation/>
				</Tabs.Panel>
				<Tabs.Panel value={TAB_LABELS.FINANCIAL}>
					<Financial/>
				</Tabs.Panel>
			</TabBar>
		</Container>
	);
};

export default settings;