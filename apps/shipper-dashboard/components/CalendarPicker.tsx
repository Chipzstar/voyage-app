import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal } from '@mantine/core';
import { Calendar } from '@mantine/dates';

const CalendarPicker = ({ opened, onClose, value, setValue }) => {

	useEffect(() => {
		onClose()
	}, [])

	return (
		<Modal opened={opened} onClose={onClose} centered size="md" withCloseButton={false} closeOnEscape closeOnClickOutside>
			<div className="flex justify-center items-center">
				<Calendar value={value} onChange={setValue} fullWidth/>
			</div>
		</Modal>
	);
};

CalendarPicker.propTypes = {
	opened: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired
};

export default CalendarPicker;
