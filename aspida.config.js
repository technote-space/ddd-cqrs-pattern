require('dotenv').config();

module.exports = {
  input: 'src/pages/api',
  baseURL: `${(process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : undefined) || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api`,
  trailingSlash: true,
};
