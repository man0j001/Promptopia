/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverComponentsExternalPackages: ["mongoose"],
    },
    images: {
      remotePatterns: [
        { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
        { protocol: 'https', hostname: 'api.dicebear.com' },
      ],
    },
    webpack(config) {
      config.experiments = {
        ...config.experiments,
        topLevelAwait: true,
      }
      return config
    }
  }
export default nextConfig;
