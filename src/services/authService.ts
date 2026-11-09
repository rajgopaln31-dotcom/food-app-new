import type { RegisterInput, StoredUser, User } from '../types';
import { delay, generateId } from '../utils/helpers';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage';

// MOCK authentication: users are kept in localStorage.
// A real app would send these requests to a backend and receive a token.

const DEMO_USER: StoredUser = {
  id: 'demo-user',
  name: 'Demo Student',
  email: 'demo@food.com',
  mobile: '9876543210',
  password: 'Demo@123',
};

function getUsers(): StoredUser[] {
  const users = loadFromStorage<StoredUser[]>(STORAGE_KEYS.users, []);
  if (users.length === 0) {
    saveToStorage(STORAGE_KEYS.users, [DEMO_USER]);
    return [DEMO_USER];
  }
  return users;
}

// Remove the password before giving a user to the UI.
function toUser(stored: StoredUser): User {
  return { id: stored.id, name: stored.name, email: stored.email, mobile: stored.mobile };
}

export async function loginRequest(identifier: string, password: string): Promise<User> {
  await delay(800);
  const text = identifier.trim().toLowerCase();
  const found = getUsers().find(
    (user) => (user.email.toLowerCase() === text || user.mobile === text) && user.password === password,
  );
  if (!found) {
    throw new Error('Invalid email/mobile number or password');
  }
  return toUser(found);
}

export async function registerRequest(input: RegisterInput): Promise<User> {
  await delay(800);
  const users = getUsers();
  if (users.some((user) => user.email.toLowerCase() === input.email.trim().toLowerCase())) {
    throw new Error('An account with this email already exists');
  }
  if (users.some((user) => user.mobile === input.mobile.trim())) {
    throw new Error('An account with this mobile number already exists');
  }
  const newUser: StoredUser = {
    id: generateId(),
    name: input.name.trim(),
    email: input.email.trim(),
    mobile: input.mobile.trim(),
    password: input.password,
  };
  saveToStorage(STORAGE_KEYS.users, [...users, newUser]);
  return toUser(newUser);
}

export async function forgotPasswordRequest(email: string): Promise<void> {
  await delay(800);
  const exists = getUsers().some((user) => user.email.toLowerCase() === email.trim().toLowerCase());
  if (!exists) {
    throw new Error('No account found with this email');
  }
  // A real backend would now send a reset e-mail. Nothing is sent in this demo.
}
