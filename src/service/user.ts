import type { SessionInfo } from '../types/auth';
import handleDBError from './_handleDBError';
import { prisma } from '../data';
import { hashPassword, verifyPassword } from '../core/password';
import { generateJWT, verifyJWT } from '../core/jwt';
import Role from '../core/roles';
import { Error } from '../core/errors';
import type { User, UserCreateInput, UserUpdateInput, PublicUser } from '../types/user';
import { HTTPException } from 'hono/http-exception'

const makeExposedUser = ({ id, name, email }: User): PublicUser => ({
  id,
  name,
  email,
});

export const checkAndParseSession = async (
  authHeader?: string,
): Promise<SessionInfo> => {
  if (!authHeader) {
    throw new HTTPException(Error.UNAUTHORIZED, {
      message: 'You need to be signed in',
    });
  }

  if (!authHeader.startsWith('Bearer ')) {
    throw new HTTPException(Error.UNAUTHORIZED, {
      message: 'You need to be signed in',
    });
  }

  const authToken = authHeader.substring(7);
  try {
    const { roles, sub } = await verifyJWT(authToken);

    return {
      userId: Number(sub),
      roles,
    };
  } catch (error: any) {

    if (error.message.includes('jwt expired')) {
      throw new HTTPException(Error.UNAUTHORIZED, {
        message: 'The token has expired',
      });
    } else if (error.message.includes('invalid token') || error.message.includes('jwt malformed')) {
      throw new HTTPException(Error.UNAUTHORIZED, {
        message: `Invalid authentication token: ${error.message}`,
      });
    } else {
      throw new HTTPException(Error.UNAUTHORIZED, {
        message: error.message,
      });
    }
  }
};


export const checkRole = (role: string, roles: string[]): void => {
  if (!roles.includes(role)) {
    throw new HTTPException(Error.FORBIDDEN, {message:'You are not allowed to view this part of the application'});
  }
};


export const login = async (
  email: string,
  password: string,
): Promise<string> => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new HTTPException(Error.UNAUTHORIZED, {message:'The given email and password do not match'});
  }

  const passwordValid = await verifyPassword(password, user.password_hash);

  if (!passwordValid) {
    throw new HTTPException(Error.UNAUTHORIZED, {message:'The given email and password do not match'});
  }

  return await generateJWT(user);
};


export const register = async ({
  name,
  email,
  password,
}: UserCreateInput): Promise<string> => {
  try {
    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password_hash: passwordHash,
        roles: [Role.USER],
      },
    });

    return await generateJWT(user);
  } catch (error) {
    throw handleDBError(error);
  }
};

export const getAll = async (): Promise<PublicUser[]> => {
  const users = await prisma.user.findMany();
  return users.map(makeExposedUser);
};

export const getById = async (id: number): Promise<PublicUser> => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new HTTPException(Error.NOT_FOUND, {message:'No user with this id exists'});
  }

  return makeExposedUser(user);
};

export const updateById = async (
  id: number,
  changes: UserUpdateInput
): Promise<PublicUser> => {
  try {
    const user = await prisma.user.update({
      where: { id },
      data: changes,
    });
    return makeExposedUser(user);
  } catch (error) {
    throw handleDBError(error);
  }
};

export const deleteById = async (id: number): Promise<void> => {
  try {
    await prisma.user.delete({ where: { id } });
  } catch (error) {
    throw handleDBError(error);
  }
};
