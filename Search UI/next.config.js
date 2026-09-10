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
                    destination: `${process.env.NEXT_PUBLIC_BASE_URL}/:path*`
                }
            ];
        }

        return [];
    },
    output: 'standalone'
};

export default nextConfig;
