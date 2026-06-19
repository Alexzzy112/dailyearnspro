const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['taskearnpro.com'],
  },
  outputFileTracingRoot: path.join(__dirname, '..'),
};

module.exports = nextConfig;

module.exports = nextConfig;
