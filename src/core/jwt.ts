import config from 'config';
import { sign, verify } from 'hono/jwt';
import type { User } from '../types/user';
import { JWTUserPayload } from '../types/auth';

const JWT_AUDIENCE = config.get<string>('auth.jwt.audience');
const JWT_SECRET = config.get<string>('auth.jwt.secret');
const JWT_ISSUER = config.get<string>('auth.jwt.issuer');
const JWT_EXPIRATION_INTERVAL = config.get<number>(
  'auth.jwt.expirationInterval',
);

export const generateJWT = async (user: User): Promise<string> => {
    const payload = {
      sub: `${user.id}`,
      email: user.email,
      roles: user.roles,
      aud: JWT_AUDIENCE,
      iss: JWT_ISSUER,
      exp: Math.floor(Date.now() / 1000) + JWT_EXPIRATION_INTERVAL
    };
  
    return await sign(payload, JWT_SECRET);
  };
  
  export const verifyJWT = async (token: string): Promise<JWTUserPayload> => {
    const payload = await verify(token, JWT_SECRET) as JWTUserPayload;
    if (payload.aud !== JWT_AUDIENCE) {
      throw new Error('Invalid audience');
    }
  
    if (payload.iss !== JWT_ISSUER) {
      throw new Error('Invalid issuer');
    }
  
    return payload;
  };

