const CopyPlugin = require('copy-webpack-plugin');

/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config, { isServer }) => {
		// Only run in server mode
		if (isServer) {
		  config.plugins.push(
			new CopyPlugin({
			  patterns: [
				{ 
				  from: 'node_modules/lightning/grpc/protos', 
				  to: './grpc/protos' 
				},
			  ],
			})
		  );
		}
		return config;
	},
}

module.exports = nextConfig
