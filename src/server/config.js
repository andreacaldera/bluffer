import fs from 'fs';

const env = process.env.NODE_ENV;
const config = JSON.parse(fs.readFileSync(`./config/${env}.json`, 'utf8'));

export default Object.assign({}, config, { env });
