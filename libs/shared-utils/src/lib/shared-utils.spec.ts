import { capitalize } from './shared-utils';

describe('prismaUtils', () => {
	it('should work', () => {
		expect(capitalize("hello")).toEqual('Hello');
	});
});
