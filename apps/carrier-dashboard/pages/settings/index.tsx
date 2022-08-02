import TabBar from '../../layout/TabBar';
import { SETTINGS_TABS } from '../../utils/constants';
import React from 'react';
import { Container, Tabs } from '@mantine/core'
import Organisation from './containers/Organisation'
import Financial from './containers/Financial'
import Accounting from './containers/Accounting'
import DocumentTypes from './containers/DocumentTypes'
import BulkImport from './containers/BulkImport'

const TAB_LABELS = {
	ORGANIZATION: 'organisation',
	FINANCIAL: 'financial',
	ACCOUNTING: 'accounting',
	DOCUMENT_TYPES: 'document-types',
	BULK_IMPORT: 'bulk-import',
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
				<Tabs.Panel value={TAB_LABELS.ACCOUNTING}>
					<Accounting/>
				</Tabs.Panel>
				<Tabs.Panel value={TAB_LABELS.DOCUMENT_TYPES}>
					<DocumentTypes/>
				</Tabs.Panel>
				<Tabs.Panel value={TAB_LABELS.BULK_IMPORT}>
					<BulkImport/>
				</Tabs.Panel>
			</TabBar>
		</Container>
	);
};

export default settings;