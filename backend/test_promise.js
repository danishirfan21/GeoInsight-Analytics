const bcrypt = require('bcryptjs');

async function test() {
  const password = 'test';
  const hash = await bcrypt.hash(password, 10);
  console.log('Is Promise:', bcrypt.compare(password, hash) instanceof Promise);
  const result = await bcrypt.compare(password, hash);
  console.log('Result:', result);
}

test();
