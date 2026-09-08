/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/mountains",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
