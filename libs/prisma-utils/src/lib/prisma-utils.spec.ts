import { prismaUtils } from './prisma-utils';

describe('prismaUtils', () => {
	it('should work', () => {
		expect(prismaUtils()).toEqual('prisma-utils');
	});
});
