require('dotenv').config();

module.exports = [
  {
    input: 'src/pages/api',
    baseURL: `${process.env.NEXT_PUBLIC_API_ENDOPOINT ?? 'http://localhost:3000'}`,
  },
  {
    input: 'src/infra/server/shared/database/notion/api',
    baseURL: `${process.env.NOTION_BASE_URL ?? 'https://api.notion.com/v1'}`,
  }
];
