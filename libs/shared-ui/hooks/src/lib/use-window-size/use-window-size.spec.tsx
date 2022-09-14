import { act, renderHook } from '@testing-library/react';
import * as React from 'react';

import useWindowSize from './use-window-size';

describe('useWindowSize', () => {
	it('should render successfully', () => {
		const { result } = renderHook(() => useWindowSize());

		expect(result.current.count).toBe(0);

		act(() => {
			result.current.increment();
		});

		expect(result.current.count).toBe(1);
	});
});
