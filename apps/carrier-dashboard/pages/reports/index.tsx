import { Tabs } from '@mantine/core';
import React from 'react';
import Container from '../../layout/Container';
import { capitalize } from '@voyage-app/shared-utils';
import ReportOverview from '../../containers/ReportOverview'

const TAB_LABELS = {
	OVERVIEW: 'overview',
	DRIVERS: 'drivers',
	DISPATCHERS: 'dispatchers',
	DOWNTIME: 'downtime',
	DOCUMENTS: 'documents'
};

const reporting = () => {
	return (
		<Container classNames="pb-4 min-h-screen">
			<Tabs defaultValue={TAB_LABELS.OVERVIEW}>
				<Tabs.List>
					{Object.values(TAB_LABELS).map((label, index) => (
						<Tabs.Tab key={index} value={label}>{capitalize(label)}</Tabs.Tab>
					))}
				</Tabs.List>
				<Tabs.Panel value={TAB_LABELS.OVERVIEW}>
					<ReportOverview/>
				</Tabs.Panel>
			</Tabs>
		</Container>
	);
};

export default reporting;
