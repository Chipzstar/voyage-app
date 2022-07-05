// apps/app1/tailwind.config.js
const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');
const { join } = require('path');

module.exports = {
	content: [
		join(
			__dirname,
			'{src,pages,components,containers}/**/*!(*.stories|*.spec).{ts,tsx,html}'
		),
		...createGlobPatternsForDependencies(__dirname),
	],
	theme: {
		extend: {
			fontFamily: {
				helvetica: ['Helvetica', 'sans']
			},
			colors:{
				'voyage-grey': {
					DEFAULT: '#CCCCCC'
				},
				'secondary': {
					DEFAULT: '#3646F5',
					'50': '#E5E7FE',
					'100': '#D1D5FD',
					'200': '#ABB1FB',
					'300': '#848EF9',
					'400': '#5D6AF7',
					'500': '#3646F5',
					'600': '#0C1EE7',
					'700': '#0917B2',
					'800': '#06107D',
					'900': '#040947'
				}
			}
		},
	},
	plugins: [],
};