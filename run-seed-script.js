import handler from './api/seed.js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const req = { method: 'POST' };
const res = {
  status: (code) => {
    console.log('Status:', code);
    return {
      json: (data) => console.log('Response:', data),
      end: () => console.log('End')
    }
  }
};

handler(req, res).then(() => {
  console.log('Done');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
