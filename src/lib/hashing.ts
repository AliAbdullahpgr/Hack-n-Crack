import { MD5 } from 'crypto-js';

export type HashAlgorithm = 'MD5' | 'SHA-1' | 'SHA-256' | 'Bcrypt' | 'Argon2id';

export type HashOptions = {
  salt?: string;
  bcryptRounds?: number;
  argon2?: {
    memoryKb?: number;
    time?: number;
    parallelism?: number;
    hashLen?: number;
  };
};

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

function hexToBytes(hex: string): Uint8Array {
  const normalized = hex.length % 2 === 0 ? hex : `0${hex}`;
  const bytes = new Uint8Array(normalized.length / 2);
  for (let i = 0; i < normalized.length; i += 2) {
    bytes[i / 2] = parseInt(normalized.slice(i, i + 2), 16);
  }
  return bytes;
}

export async function getHash(
  algorithm: HashAlgorithm,
  text: string,
  options: HashOptions = {}
): Promise<string> {
  const salt = options.salt ?? '';
  const textToHash = salt ? `${text}{${salt}}` : text;

  switch (algorithm) {
    case 'MD5':
      return MD5(textToHash).toString();
    case 'SHA-1':
      return await hashWithSHA('SHA-1', textToHash);
    case 'SHA-256':
      return await hashWithSHA('SHA-256', textToHash);
    case 'Bcrypt': {
      const bcrypt = await import('bcryptjs');
      const rounds = options.bcryptRounds ?? 10;
      return await bcrypt.hash(textToHash, rounds);
    }
    case 'Argon2id': {
      const argon2Module = await import('argon2-browser/dist/argon2-bundled.min.js');
      const argon2 = (argon2Module as unknown as { default?: any } | any).default ?? argon2Module;
      const hashFn = argon2.hash ?? argon2Module.hash;
      const ArgonType = argon2.ArgonType ?? argon2Module.ArgonType;
      const memoryKb = options.argon2?.memoryKb ?? 19456;
      const time = options.argon2?.time ?? 3;
      const parallelism = options.argon2?.parallelism ?? 1;
      const hashLen = options.argon2?.hashLen ?? 32;
      const safeSalt = salt || generateSalt(16);
      const saltBytes = hexToBytes(safeSalt);
      const result = await hashFn({
        pass: textToHash,
        salt: saltBytes,
        time,
        mem: memoryKb,
        parallelism,
        hashLen,
        type: ArgonType?.Argon2id ?? 2,
      });
      return result.encoded;
    }
    default:
      throw new Error('Unsupported algorithm');
  }
}
