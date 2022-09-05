import { render } from '@testing-library/react';

import CustomLoader from './custom-loader';

describe('CustomLoader', () => {
	it('should render successfully', () => {
		const { baseElement } = render(<CustomLoader text={"Loading..."}/>);
		expect(baseElement).toBeTruthy();
	});
});
