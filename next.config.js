/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
};

module.exports = {
    ...nextConfig,
    env: {
        EMAIL: "mce@almuhaidgroup.com",
        PASS: "PA$$w0rd",
    },
    swcMinify: true,
    webpack(config) {
        config.resolve.fallback = {
            ...config.resolve.fallback, // if you miss it, all the other options in fallback, specified
            // by next.js will be dropped. Doesn't make much sense, but how it is
            fs: false, // the solution
        };

        return config;
    },
};
