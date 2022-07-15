import React, { useEffect, useReducer } from 'react';
import { TabContext } from './index';
import { useRouter } from 'next/router';

const indexReducer = (state, action) => {
	switch (action.type) {
		case 'setIndex':
			return action.index;
		default:
			return state;
	}
};

const TabContextProvider = ({ children }) => {
	const router = useRouter();

	useEffect(()=>{
		const hash = router.asPath.split('#');
	}, [ router.asPath ]);

	const [val, setVal] = useReducer(indexReducer, router.asPath.split('#').length, (tabIndex) => tabIndex <= 1 ? 0 : Number(router.asPath.split('#').at(-1)));

	return <TabContext.Provider value={{ index: val, dispatch: setVal }}>{children}</TabContext.Provider>;
};

export default TabContextProvider;