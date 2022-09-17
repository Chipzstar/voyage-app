const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');
const { join } = require('path');

module.exports = {
	content: [
		join(
			__dirname,
			'{src,pages,components,containers,layout,modals}/**/*!(*.stories|*.spec).{ts,tsx,html}'
		),
		...createGlobPatternsForDependencies(__dirname),
	],
	theme: {
		extend: {
			fontFamily: {
				helvetica: ['Helvetica', 'sans']
			},
			spacing: {
				'128': '32rem',
				'196': '36rem',
				'256': '40rem'
			},
			colors:{
				'voyage-grey': {
					DEFAULT: '#CCCCCC',
					'50': '#FFFFFF',
					'100': '#FFFFFF',
					'200': '#FFFFFF',
					'300': '#F5F5F5',
					'400': '#E0E0E0',
					'500': '#CCCCCC',
					'600': '#B0B0B0',
					'700': '#949494',
					'800': '#787878',
					'900': '#5C5C5C'
				},
				'voyage-background': {
					DEFAULT: '#F6F7F9',
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
				},
				new: {
					DEFAULT: '#FF665C',
					'50': '#FFFFFF',
					'100': '#FFFFFF',
					'200': '#FFD9D6',
					'300': '#FFB3AE',
					'400': '#FF8C85',
					'500': '#FF665C',
					'600': '#FF3124',
					'700': '#EB0E00',
					'800': '#B30B00',
					'900': '#7B0800'
				},
				pending: {
					DEFAULT: `rgb(153 51 204)`,
					50: "#E2C6F1",
					100: "#DAB6ED",
					200: "#CA95E4",
					300: "#BA74DC",
					400: "#A954D4",
					500: "#9933CC",
					600: "#77289F",
					700: "#561D72",
					800: "#341145",
					900: "#120618"
				},
				dispatched: {
					DEFAULT: `rgba(255 122 0)`,
					50: "#FFDAB8",
					100: "#FFCFA3",
					200: "#FFBA7A",
					300: "#FFA552",
					400: "#FF8F29",
					500: "#FF7A00",
					600: "#C75F00",
					700: "#8F4400",
					800: "#572900",
					900: "#1F0F00"
				},
				"en-route": {
					DEFAULT: `rgb(66 133 244)`,
					50: "#F0F5FE",
					100: "#DCE9FD",
					200: "#B6D0FB",
					300: "#8FB7F8",
					400: "#699EF6",
					500: "#4285F4",
					600: "#0E63F0",
					700: "#0B4DBB",
					800: "#083786",
					900: "#052151"
				},
				completed: {
					DEFAULT: `rgb(0, 255 25)`,
					50: "#B8FFBF",
					100: "#A3FFAC",
					200: "#7AFF87",
					300: "#52FF63",
					400: "#29FF3E",
					500: "#00FF19",
					600: "#00C714",
					700: "#008F0E",
					800: "#005709",
					900: "#001F03"
				},
				cancelled: {
					DEFAULT: `rgb(86 86 86)`,
					50: "#B2B2B2",
					100: "#A8A8A8",
					200: "#939393",
					300: "#7F7F7F",
					400: "#6A6A6A",
					500: "#565656",
					600: "#3A3A3A",
					700: "#1E1E1E",
					800: "#020202",
					900: "#000000"
				},
				expired: {
					DEFAULT: '#964B00',
					'50': '#FFA74F',
					'100': '#FF9D3A',
					'200': '#FF8811',
					'300': '#E87400',
					'400': '#BF5F00',
					'500': '#964B00',
					'600': '#5E2F00',
					'700': '#261300',
					'800': '#000000',
					'900': '#000000'
				}
			}
		},
	},
	plugins: [],
};