import React from 'react';

const Billing = () => {
	return (
		<div className='p-4 h-screen'>
			<div className='px-4 grid grid-cols-2 gap-8 h-full'>
				<section>
					<header className='flex flex-row items-center justify-between mb-8 py-3 h-20'>
						<h2 className='page-header'>Billing</h2>
					</header>
					<div className='border border-2 border-gray-300 py-8 px-4 flex flex-col justify-center space-y-4 w-96 lg:w-128'>
						<span className='uppercase text-xl'>Total Balance Due</span>
						<span className='text-4xl font-bold text-secondary'>£0</span>
						<span className='text-red-500 text-lg'>Overdue Balance: £0</span>
					</div>
				</section>
				<section>
					<header className='flex flex-row items-center justify-between mb-8 py-3 h-20'>
						<h2 className='page-header'>Invoices</h2>
					</header>
					<div className="flex flex-col justify-center">
						<span className="text-3xl font-semibold">No Invoices Created</span>
					</div>
				</section>
			</div>
		</div>
	);
};

export default Billing;
