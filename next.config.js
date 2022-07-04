/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
}

module.exports = {
    ...nextConfig,
    env: {
        EMAIL: 'mce@almuhaidgroup.com',
        PASS: 'PA$$w0rd'
    },
    swcMinify: true
}

