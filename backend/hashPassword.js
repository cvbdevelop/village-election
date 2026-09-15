const bcrypt = require('bcryptjs');

const passwords = {
  admin123: null,
  observer123: null,
};

Object.keys(passwords).forEach((pwd) => {
  const hash = bcrypt.hashSync(pwd, 10);
  console.log(`Password: ${pwd}`);
  console.log(`Hash: ${hash}`);
  console.log('---');
});