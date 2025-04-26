import * as userService from '../service/user';
import { Hono } from "hono";
import type { Context, Hono as HonoInstance } from 'hono';
import { HTTPException } from "hono/http-exception";
import Role from '../core/roles';
import { Error } from "../core/errors";
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { makeRequireRole, requireAuthentication } from '../core/auth';

const checkUserId = async (c: Context, next: () => Promise<void>) => {
    const session = c.get('session');
    const { userId, roles } = session;
    const { id } = c.req.param();
  
    if (id !== 'me' && id !== String(userId) && !roles.includes(Role.ADMIN)) {
      throw new HTTPException(Error.FORBIDDEN, {
        message: "You are not allowed to view this user\'s information",
      });
    }
    await next();
};

const registerUser = async (c : Context) => {
    const body = await c.req.json();
    const token = await userService.register(body);
    return c.json({ token }, 200);
};
registerUser.validationScheme = z.object({
    name: z.string().max(255),
    email: z.string().email(),    
    password: z.string(), 
});

const getAllUsers = async (c : Context) => {
    const users = await userService.getAll();
    return c.json({ items: users });
};

const getUserById = async (c : Context) => {
    const { id } = c.req.param(); 
    const session = c.get('session');
    const user = await userService.getById(id === 'me' ? session.userId : Number(id));
    return c.json(user);
}
getUserById.validationScheme =z.object({
    id: z.union([
        z.coerce.number().int().positive(),
        z.literal('me'),
    ]),
});

const updateUserById = async (c : Context) => {
    const { id } = c.req.param();
    const data = await c.req.json();
    const user = await userService.updateById(Number(id), data);
    return c.json(user);
};
updateUserById.validationScheme = z.object({
    name: z.string().max(255),
    email: z.string().email(),    
});
updateUserById.paramsScheme = z.object({
    id: z.coerce.number().int().positive()  
});


const deleteUserById = async (c : Context) => {
    const { id } = c.req.param();
    await userService.deleteById(Number(id));
    return c.body(null, 204);
};
deleteUserById.validationScheme =z.object({
    id: z.coerce.number().int().positive()
});

const installUserRoutes = (parent: HonoInstance) => {
    const router = new Hono();
    const requireAdmin = makeRequireRole(Role.ADMIN);
  
    router.post( 
      '/',
      requireAuthentication,
      zValidator('json', registerUser.validationScheme),
      registerUser
    );
    
    router.get(
      '/',
      requireAuthentication,
      requireAdmin,
      checkUserId,
      getAllUsers
    );
  
    router.get(
      '/:id',
      requireAuthentication,
      zValidator('param', getUserById.validationScheme),
      checkUserId,
      getUserById
    );
  
    router.put(
      '/:id',
      requireAuthentication,
      zValidator('param', updateUserById.paramsScheme),
      zValidator('json', updateUserById.validationScheme),
      checkUserId,
      updateUserById
    );
    
    router.delete(
      '/:id',
      requireAuthentication,
      zValidator('param', deleteUserById.validationScheme),
      checkUserId,
      deleteUserById
    );
   
    parent.route('/users', router);
};
  
export default installUserRoutes;