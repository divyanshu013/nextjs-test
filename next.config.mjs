/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize @pspdfkit/nodejs to prevent it from being bundled on the server
      // This resolves issues with dependencies that are not compatible with webpack
      // See: https://nextjs.org/docs/api-reference/next.config.js/custom-webpack-config
      // Before I was getting this error:
      // Failed to compile
      // https://deno.land/std/path/mod.ts
      // Module build failed: UnhandledSchemeError: Reading from "https://deno.land/std/path/mod.ts" is not handled by plugins (Unhandled scheme).
      config.externals.push('@pspdfkit/nodejs');
    }
    return config;
  }
};

export default nextConfig;
