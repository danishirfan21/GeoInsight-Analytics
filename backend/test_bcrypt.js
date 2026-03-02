const bcrypt = require('bcryptjs');

async function test() {
    const password = 'admin123';
    const hash = await bcrypt.hash(password, 10);
    console.log('Hash:', hash);
    const match = await bcrypt.compare(password, hash);
    console.log('Match:', match);

    const wrongMatch = await bcrypt.compare('wrong', hash);
    console.log('Wrong Match:', wrongMatch);
}

test();
