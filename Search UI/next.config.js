/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: [
        'styled-components',
        '@mui/material',
        '@mui/system',
        '@mui/icons-material'
    ],
    compiler: {
        styledComponents: true
    },
    async rewrites() {
        if (process.env.NODE_ENV === 'development') {
            return [
                {
                    source: '/search-api/:path*',
                    destination: `${process.env.BASE_URL_SEARCH_API}/:path*`
                }
            ];
        }

        return [];
    },
    output: 'standalone'
};

export default nextConfig;
