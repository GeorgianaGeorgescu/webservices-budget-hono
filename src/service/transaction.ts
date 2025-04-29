import { prisma } from '../data';
import type { Transaction, TransactionCreateInput, TransactionUpdateInput } from '../types/transaction';
import Role from '../core/roles';
import { Error } from '../core/errors';
import handleDBError from './_handleDBError';
import { HTTPException } from 'hono/http-exception';
import * as placeService from './place';

const TRANSACTION_SELECT = {
  id: true,
  amount: true,
  date: true,
  place: true,
  user: {
    select: {
      id: true,
      name: true,
    },
  },
};

export const getAll = async (userId: number, roles: string[]): Promise<Transaction[]> => {
  return prisma.transaction.findMany({
    where:  roles.includes(Role.ADMIN) ? {} : { user_id: userId },
    select: TRANSACTION_SELECT,
  });
};

export const getById = async (id: number, userId: number, roles: string[]): Promise<Transaction> => {
  const extraFilter = roles.includes(Role.ADMIN) ? {} : { user_id: userId };

  const transaction = await prisma.transaction.findUnique({
    where: {
      id,
      ...extraFilter,
    },
    select: TRANSACTION_SELECT,
  });

  if (!transaction) {
     throw new HTTPException(Error.NOT_FOUND, {message:'No transaction with this id exists'});
  }

  return transaction;
};

export const create = async ({
  amount,
  date,
  placeId,
  userId,
}: TransactionCreateInput): Promise<Transaction> => {
  try {
    await placeService.checkPlaceExists(placeId);

    return await prisma.transaction.create({
      data: {
        amount,
        date,
        user_id: userId,
        place_id: placeId,
      },
      select: TRANSACTION_SELECT,
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const updateById = async (id: number, {
  amount,
  date,
  placeId,
  userId,
}: TransactionUpdateInput): Promise<Transaction> => {
  try {
    await placeService.checkPlaceExists(placeId);

    return await prisma.transaction.update({
      where: {
        id,
        user_id: userId,
      },
      data: {
        amount,
        date,
        place_id: placeId,
      },
      select: TRANSACTION_SELECT,
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const deleteById = async (id: number, userId: number): Promise<void> => {
  try {
    await prisma.transaction.delete({
      where: {
        id,
        user_id: userId,
      },
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const getTransactionsByPlaceId = async (placeId: number, userId: number): Promise<Transaction[]> => {
  return prisma.transaction.findMany({
    where: {
      place_id: placeId,
      user_id: userId,
    },
    select: TRANSACTION_SELECT,
  });
};
