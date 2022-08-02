import React, { useState } from 'react'
import ContentContainer from '../../layout/ContentContainer'
import { Tabs } from '@mantine/core'
import Invoices from '../../containers/Invoices'

const TAB_LABELS = {
	ALL: 'all',
	INVOICED: 'invoiced',
	PAID: 'paid',
	OVERDUE: 'overdue'
}

const invoices = () => {
	const [activeTab, setActiveTab] = useState(TAB_LABELS.ALL);
	return (
		<ContentContainer classNames='py-4 px-8 h-screen'>
			<div className='flex flex-col justify-evenly h-full'>
				<section className='border border-voyage-grey py-10 px-20 flex justify-around'>
					<div className="flex flex-col items-center space-y-4">
						<span className="display-1">2</span>
						<span  className="text-lg text-purple-500">Awaiting</span>
					</div>
					<div className="flex flex-col items-center space-y-4">
						<span className="display-1">6</span>
						<span className="text-lg text-amber-500">Pending</span>
					</div>
					<div className="flex flex-col items-center space-y-4">
						<span className="display-1">5</span>
						<span className="text-lg text-green-500">Paid</span>
					</div>
				</section>
				<section>
					<header className='page-subheading py-4'>Invoice History</header>
					<Tabs value={activeTab} onTabChange={setActiveTab}>
						<Tabs.List grow>
							<Tabs.Tab value={TAB_LABELS.ALL}>All</Tabs.Tab>
							<Tabs.Tab value={TAB_LABELS.INVOICED}>Invoiced</Tabs.Tab>
							<Tabs.Tab value={TAB_LABELS.PAID}>Paid</Tabs.Tab>
							<Tabs.Tab value={TAB_LABELS.OVERDUE}>Overdue</Tabs.Tab>
						</Tabs.List>
						<Tabs.Panel value={TAB_LABELS.ALL}>
							<Invoices message={<span className="text-center text-2xl">You have no invoices</span>}/>
						</Tabs.Panel>
						<Tabs.Panel value={TAB_LABELS.INVOICED}>
							<Invoices message={<span className="text-center text-2xl">You have no invoices</span>}/>
						</Tabs.Panel>
						<Tabs.Panel value={TAB_LABELS.PAID}>
							<Invoices message={<span className="text-center text-2xl">You have no invoices</span>}/>
						</Tabs.Panel>
						<Tabs.Panel value={TAB_LABELS.OVERDUE}>
							<Invoices message={<span className="text-center text-2xl">You have no invoices</span>}/>
						</Tabs.Panel>
					</Tabs>
				</section>
			</div>
		</ContentContainer>
	)
}

export default invoices
