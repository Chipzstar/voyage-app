import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { PATHS } from '../utils';

const EmptyTable = props => {
	const router = useRouter();
	return (
		<div className="space-y-8 h-full flex flex-col grow justify-center items-center">
			<h3 className='text-5xl font-light'>Welcome to Voyage!</h3>
			<p className='text-xl'>Your middle mile shipping partner optimizing your shipments.</p>
			<button className='voyage-button' onClick={() => router.push(PATHS.QUOTE)}>
				Get a new quote
			</button>
		</div>
	);
};

EmptyTable.propTypes = {

};

export default EmptyTable;
