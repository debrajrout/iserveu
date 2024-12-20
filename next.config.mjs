/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true, // Ensure strict mode for React is enabled
    images: {
        domains: ['lh3.googleusercontent.com'], // Allow images from Googleusercontent
    },
};

export default nextConfig;
