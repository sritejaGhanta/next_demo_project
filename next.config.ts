import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      'lh3.googleusercontent.com', 
      'img.icons8.com', 
      'avatars.githubusercontent.com',
      'localhost',
      '192.168.20.131',
      'example.com'
    ],
  },

};

export default nextConfig;
