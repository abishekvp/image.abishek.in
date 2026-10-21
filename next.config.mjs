/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: "/compress",
        destination: "/",
        permanent: true,
      },
      {
        source: "/compressor",
        destination: "/",
        permanent: true,
      },
      {
        source: "/converter",
        destination: "/convert",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
