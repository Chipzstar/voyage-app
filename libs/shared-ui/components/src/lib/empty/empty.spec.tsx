import { render } from '@testing-library/react';

import Empty from './empty';

describe('Empty', () => {
	it('should render successfully', () => {
		const { baseElement } = render(<Empty />);
		expect(baseElement).toBeTruthy();
	});
});
