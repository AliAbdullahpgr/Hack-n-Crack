import { MD5 } from 'crypto-js';

// Web Crypto API for SHA hashing
async function hashWithSHA(algorithm: 'SHA-1' | 'SHA-256', text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export function generateSalt(length = 16): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function getHash(algorithm: 'MD5' | 'SHA-1' | 'SHA-256', text: string, salt: string = ''): Promise<string> {
  const textToHash = salt ? `${text}{${salt}}` : text;
  
  switch (algorithm) {
    case 'MD5':
      // crypto-js MD5 is synchronous
      return MD5(textToHash).toString();
    case 'SHA-1':
      return await hashWithSHA('SHA-1', textToHash);
    case 'SHA-256':
      return await hashWithSHA('SHA-256', textToHash);
    default:
      throw new Error('Unsupported algorithm');
  }
}
