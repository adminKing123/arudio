/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/harshcore/arsongs-src-copy/**",
      },
    ],
  },
};

export default nextConfig;
