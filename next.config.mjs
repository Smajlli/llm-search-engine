/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/chat',
                permanent: true
            },
        ];
    },
};

export default nextConfig;
