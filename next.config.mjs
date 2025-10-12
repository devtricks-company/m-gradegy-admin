/**
 * @type {import('next').NextConfig}
 */

const isStaticExport = 'false';

const nextConfig = {
  export: { output: 'standalone' },
  trailingSlash: true,
  env: {
    BUILD_STATIC_EXPORT: isStaticExport,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.gradegy.com',
      },
    ],
  },
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
    '@mui/material': {
      transform: '@mui/material/{{member}}',
    },
    '@mui/lab': {
      transform: '@mui/lab/{{member}}',
    },
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  ...(isStaticExport === 'true' && {
    output: 'export',
  }),
};

export default nextConfig;
