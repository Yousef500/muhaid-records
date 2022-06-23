/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
}

module.exports = {
    ...nextConfig,
    env: {
        MYSQL_USER: process.env.MYSQL_USER,
        MYSQL_PASS: process.env.MYSQL_PASS,
        EMAIL: process.env.EMAIL,
        PASSWORD: process.env.PASSWORD
    }
}
