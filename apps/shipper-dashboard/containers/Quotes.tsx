import React from 'react';
import { useRouter } from 'next/router';
import { PATHS } from '../utils';

const Quotes = () => {
	const router = useRouter();
	return (
		<div className='flex flex-col justify-center items-center space-y-8 py-5 booking-container'>
			<h3 className='text-5xl font-light'>Welcome to Voyage!</h3>
			<p className='text-xl'>Your middle mile shipping partner optimizing your shipments.</p>
			<button className='bg-secondary-500 hover:bg-secondary-700 text-white font-medium h-12 w-48' onClick={() => router.push(PATHS.QUOTE)}>
				Get a new quote
			</button>
		</div>
	);
};

export default Quotes;
