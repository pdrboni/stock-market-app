import crypto from 'crypto';

export const comparePassword = async (password, storedHash) => {
  const result = await new Promise((resolve, reject) => {
    const [salt, key] = storedHash.split(':');

    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);

      const isMatch = crypto.timingSafeEqual(
        Buffer.from(key, 'hex'),
        derivedKey,
      );

      resolve(isMatch);
    });
  });

  return result;
};
