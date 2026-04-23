
import crypto from 'crypto';

export function generateUserData() {
  const unique = crypto.randomUUID().replace(/-/g, '').slice(0, 5);

  return {
    login: `usr${unique}`,
    email: `e${unique}@test.com`,
    password: `Pass1234!`,
  };
}