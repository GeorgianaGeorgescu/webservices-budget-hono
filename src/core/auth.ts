import { MiddlewareHandler } from 'hono';
import config from 'config';
import * as userService from '../service/user';

const AUTH_MAX_DELAY = config.get<number>('auth.maxDelay');

export const requireAuthentication: MiddlewareHandler = async (c, next) => {
  const authorization = c.req.header('authorization');

  const session = await userService.checkAndParseSession(authorization);

  c.set('session', session);

  await next();
};

export const makeRequireRole = (role: string): MiddlewareHandler => {
    return async (c, next) => {
      const session = c.get('session');
      const roles = session?.roles ?? [];
  
      userService.checkRole(role, roles);
  
      await next();
    };
}


export const authDelay: MiddlewareHandler = async (c, next) => {
  const delay = Math.round(Math.random() * AUTH_MAX_DELAY);
  await new Promise((resolve) => setTimeout(resolve, delay));

  await next();
};