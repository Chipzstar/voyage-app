import { render } from '@testing-library/react';

import CalendarFilter from './calendar-filter';

describe('CalendarFilter', () => {
	it('should render successfully', () => {
		const { baseElement } = render(<CalendarFilter />);
		expect(baseElement).toBeTruthy();
	});
});
