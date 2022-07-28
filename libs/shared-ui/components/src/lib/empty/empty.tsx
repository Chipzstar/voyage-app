import styles from './empty.module.css';
import React from 'react'

/* eslint-disable-next-line */
export interface EmptyProps {
	message: JSX.Element
}

export function Empty(props: EmptyProps) {
	return (
		<div className='text-center leading-loose'>
			{props.message}
		</div>
	);
}

export default Empty;
