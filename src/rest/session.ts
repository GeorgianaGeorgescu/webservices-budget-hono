import { Hono } from 'hono';
import { Context } from 'hono';
import type { Hono as HonoInstance } from 'hono';
import * as userService from '../service/user';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod'
import { LoginRequest } from '../types/user';

const login = async (c: Context) => {
    const body = await c.req.json<LoginRequest>();
    const { email, password } = body;
    const token = await userService.login(email, password);
    
    return c.json({ token });
};
const loginSchema = z.object({
    email: z.string().email(),    
    password: z.string(), 
});

const installSessionRoutes = (parent: HonoInstance) => {
    const router = new Hono();
    router.post('/',zValidator('json', loginSchema), login);
    parent.route('/sessions', router);
};
  
export default installSessionRoutes;