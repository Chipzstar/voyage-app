/* eslint-disable */
export default {
	displayName: 'shared-ui-hooks',
	preset: '../../../jest.preset.js',
	transform: {
		'^.+\\.[tj]sx?$': 'babel-jest'
	},
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
	coverageDirectory: '../../../coverage/libs/shared-ui/hooks'
};
