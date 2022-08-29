import React, { useState } from 'react';
import { Tabs } from '@mantine/core';
import { SignupStatus } from '../utils/types';

const TabBar = ({ tabLabels, defaultTab, status, children }) => {
	const [activeTab, setActiveTab] = useState<string | null>(defaultTab);
	return (
		<Tabs value={activeTab} onTabChange={(value) => status !== SignupStatus.COMPLETE ? setActiveTab(status): setActiveTab(value)}>
			<Tabs.List grow>
				{tabLabels.map((tab, index) => (
					<Tabs.Tab key={index} value={tab.value}>{tab.label}</Tabs.Tab>
				))}
			</Tabs.List>
			{children}
		</Tabs>
	);
};

TabBar.propTypes = {};

export default TabBar;
