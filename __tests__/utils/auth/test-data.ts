import { v4 as uuidv4 } from 'uuid';

export function generateUserData() {
  const unique = uuidv4().replace(/-/g, '').slice(0, 5);

  return {
    login: `usr${unique}`, 
    email: `e${unique}@test.com`,
    password: `Pass1234!`,
  };
}