import React from 'react';

const EmptyTable = ({ content }) => {
	return (
		<div className="py-5 flex justify-center items-center h-full">
			{content}
		</div>
	)
};

EmptyTable.propTypes = {

};

export default EmptyTable;
