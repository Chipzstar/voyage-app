// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require('@nrwl/next/plugins/with-nx');
const path = require('path');

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
	nx: {
		// Set this to true if you would like to use SVGR
		// See: https://github.com/gregberge/svgr
		svgr: false
	},
	sassOptions: {
		includePaths: [path.join(__dirname, 'scss')]
	},
	webpack: (config, options) => {
		config.experiments = {
			topLevelAwait: true,
			layers: true
		};
		return config;
	}
};

module.exports = withNx(nextConfig);