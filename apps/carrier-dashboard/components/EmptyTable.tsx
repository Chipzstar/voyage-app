import React from 'react';

const EmptyTable = ({ content }) => {
	return (
		<div className="py-5 booking-container flex">
			{content}
		</div>
	)
};

EmptyTable.propTypes = {

};

export default EmptyTable;
