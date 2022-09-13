import React, { useEffect, useState } from 'react';
import { Tabs } from '@mantine/core';
import { ActivationStatus } from '../utils/types';

const TabBar = ({ tabLabels, activeTab, setActiveTab, status, children }) => {

	useEffect(() => console.log("TabBar", activeTab), [activeTab]);

	return (
		<Tabs value={activeTab} onTabChange={(value) => status !== ActivationStatus.COMPLETE ? setActiveTab(status): setActiveTab(value)}>
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
