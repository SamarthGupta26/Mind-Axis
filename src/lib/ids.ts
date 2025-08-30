import { nanoid } from 'nanoid';

export function generateRoomId(): string {
  return nanoid(8); // 8 character room ID
}

export function generateUserId(): string {
  return nanoid(12); // 12 character user ID
}

export function isValidRoomId(id: string): boolean {
  return /^[A-Za-z0-9_-]{8}$/.test(id);
}
