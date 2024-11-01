/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: '**',  // Allow all hostnames with HTTPS
          },
          {
            protocol: 'http',
            hostname: '**',  // Allow all hostnames with HTTP
          },
        ],
      },
};

export default nextConfig;
