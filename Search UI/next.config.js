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
    output: 'standalone'
};

export default nextConfig;
