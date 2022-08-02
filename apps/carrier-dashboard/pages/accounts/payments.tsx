import React from 'react';
import ContentContainer from '../../layout/ContentContainer';
import Payments from '../../containers/Payments';

const payments = () => {
	return (
		<ContentContainer classNames='py-4 px-8 h-screen'>
			<div className='flex flex-col justify-evenly h-full'>
				<section className='py-10 flex space-x-20'>
					<div className='flex flex-col space-y-4'>
						<span className='display-1 font-normal'>£204,750</span>
						<span>Gross Payments</span>
					</div>
					<div className='flex flex-col space-y-4'>
						<span className='display-1 font-normal'>£0.00</span>
						<span>Net Payments</span>
					</div>
				</section>
				<section>
					<Payments message={<span className="text-2xl text-center">No payments have been recorded</span>} />
				</section>
			</div>
		</ContentContainer>
	);
};

export default payments
