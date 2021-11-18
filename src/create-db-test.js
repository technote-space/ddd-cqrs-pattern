import axios from 'axios';
import dotenv from 'dotenv';
import {readFile} from 'fs/promises';
import {resolve} from 'path';

dotenv.config();

// 登録用スクリプト
//
// const createSchema = async (name, replaces = []) => ({
//   ...JSON.parse(replaces.reduce((acc, replace) => acc.replace(`\${${replace.key}}`, replace.value), (await readFile(resolve(process.cwd(), 'schema', `${name}.json`))).toString())),
//   parent: {
//     type: 'page_id',
//     page_id: process.env.PARENT_ID,
//   },
// });
//
// const user = await axios.post(
//   'https://api.notion.com/v1/databases/',
//   await createSchema('user'),
//   {
//     headers: {
//       'Authorization': `Bearer ${process.env.NOTION_SECRET}`,
//       'Content-Type': 'application/json',
//       'Notion-Version': '2021-08-16',
//     },
//   },
// );
//
// console.log(user.data);
//
// const tag = await axios.post(
//   'https://api.notion.com/v1/databases/',
//   await createSchema('tag', [{key: 'TAG_DB_ID', value: user.data.id}]),
//   {
//     headers: {
//       'Authorization': `Bearer ${process.env.NOTION_SECRET}`,
//       'Content-Type': 'application/json',
//       'Notion-Version': '2021-08-16',
//     },
//   },
// );
//
// console.log(tag.data);
//
// const task = await axios.post(
//   'https://api.notion.com/v1/databases/',
//   await createSchema('task', [{key: 'USER_DB_ID', value: user.data.id}, {key: 'TAG_DB_ID', value: tag.data.id}]),
//   {
//     headers: {
//       'Authorization': `Bearer ${process.env.NOTION_SECRET}`,
//       'Content-Type': 'application/json',
//       'Notion-Version': '2021-08-16',
//     },
//   },
// );
//
// console.log(task.data);


// 取得用スクリプト
//
console.log((await axios.get(
  `https://api.notion.com/v1/blocks/${process.env.PARENT_ID}/children`, {
    headers: {
      'Authorization': `Bearer ${process.env.NOTION_SECRET}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2021-08-16',
    },
  },
)).data.results.filter(result => result.type === 'child_database'));
