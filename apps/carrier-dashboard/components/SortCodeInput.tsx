import React from 'react';
import { InputBase } from '@mantine/core';
import InputMask from 'react-input-mask';

const SortCodeInput = ({value, onChange, required, disabled}) => {
	return (
		<InputBase label="Sort Code" required={required} disabled={disabled} radius={0} component={InputMask} mask={"99-99-99"} placeholder="XX-XX-XX" value={value} onChange={onChange}/>
	);
};

export default SortCodeInput;
