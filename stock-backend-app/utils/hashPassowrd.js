import crypto from 'crypto';

export const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');

    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);

      // salvamos salt + hash juntos
      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
};
