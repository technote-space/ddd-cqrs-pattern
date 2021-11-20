require('dotenv').config();

module.exports = {
  input: 'src/pages/api',
  baseURL: `${process.env.NEXT_PUBLIC_API_ENDOPOINT ?? 'http://localhost:3000'}`,
};
