import styles from './empty.module.css';
import React from 'react'

/* eslint-disable-next-line */
export interface EmptyProps {
	message: string
}

export function Empty(props: EmptyProps) {
	return (
		<div className='mx-auto my-auto'>
			<span className='text-center text-3xl my-auto mx-auto'>{props.message}</span>
		</div>
	);
}

export default Empty;
