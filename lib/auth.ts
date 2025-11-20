import { cookies } from 'next/headers';

export function getAuthToken() {
  const store = cookies();
  return store.get('auth_token')?.value || null;
}
