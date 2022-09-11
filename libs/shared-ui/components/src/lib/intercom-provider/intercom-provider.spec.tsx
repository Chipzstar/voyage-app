import { render } from '@testing-library/react';

import IntercomProvider from './intercom-provider';

describe('IntercomProvider', () => {
	it('should render successfully', () => {
		const { baseElement } = render(<IntercomProvider />);
		expect(baseElement).toBeTruthy();
	});
});
