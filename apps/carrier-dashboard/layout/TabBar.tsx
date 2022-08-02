import React, { useState } from 'react';
import { Tabs } from '@mantine/core';

const TabBar = ({ tabLabels, defaultTab, children }) => {
	const [activeTab, setActiveTab] = useState<string | null>(defaultTab);
	return (
		<Tabs value={activeTab} onTabChange={setActiveTab}>
			<Tabs.List grow>
				{tabLabels.map(tab => (
					<Tabs.Tab value={tab.value}>{tab.label}</Tabs.Tab>
				))}
			</Tabs.List>
			{children}
		</Tabs>
	);
};

TabBar.propTypes = {};

export default TabBar;
