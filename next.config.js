/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Serves this app under yourdomain.com/assistant. If you deploy this as its
  // own subdomain instead (e.g. assistant.sunnyscholarslearning.com), delete
  // the line below.
  basePath: "/assistant",
};

module.exports = nextConfig;
