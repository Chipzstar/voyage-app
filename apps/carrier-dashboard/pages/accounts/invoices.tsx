import React, { useState } from 'react'
import Container from '../../layout/Container'
import { Tabs } from '@mantine/core'
import { STATUS } from '@voyage-app/shared-types'
import Invoices from '../../containers/Invoices'

const invoices = () => {
	const [activeTab, setActiveTab] = useState(0);
	return (
		<Container classNames='py-4 px-8 h-screen'>
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
					<Tabs active={activeTab} onTabChange={setActiveTab} grow>
						<Tabs.Tab label='All'>
							<Invoices message={<span className="text-center text-2xl">There are no upcoming Loads!"</span>}/>
						</Tabs.Tab>
						<Tabs.Tab label='Invoiced' >
							<Invoices message={<span className="text-center text-2xl">There are no upcoming Loads!"</span>}/>
						</Tabs.Tab>
						<Tabs.Tab label='Paid'>
							<Invoices message={<span className="text-center text-2xl">There are no upcoming Loads!"</span>}/>
						</Tabs.Tab>
						<Tabs.Tab label='Over Due'>
							<Invoices message={<span className="text-center text-2xl">There are no upcoming Loads!"</span>}/>
						</Tabs.Tab>
					</Tabs>
				</section>
			</div>
		</Container>
	)
}

export default invoices
