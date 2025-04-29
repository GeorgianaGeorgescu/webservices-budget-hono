import { HTTPException } from 'hono/http-exception';
import { prisma } from '../data';
import type { Place, PlaceCreateInput, PlaceUpdateInput } from '../types/place';
import handleDBError from './_handleDBError';
import { Error } from '../core/errors';

export const getAll = async (): Promise<Place[]> => {
  return prisma.place.findMany();
};

export const getById = async (id: number): Promise<Place> => {
  const place = await prisma.place.findUnique({
    where: {
      id,
    }, include: {
      transactions: {
        select: {
          id: true,
          amount: true,
          date: true,
          place: true,
          user: true,
        },
      },
    },
  });

  if (!place) {
    throw new HTTPException(Error.NOT_FOUND, {message:'No place with this id exists'});
  }

  return place;
};

export const create = async (place: PlaceCreateInput): Promise<Place> => {
  try {
    return await prisma.place.create({
      data: place,
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const updateById = async (id: number, changes: PlaceUpdateInput): Promise<Place> => {
  try {
    return await prisma.place.update({
      where: {
        id,
      },
      data: changes,
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const deleteById = async (id: number) => {
  try {
    await prisma.place.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const checkPlaceExists = async (id: number) => {
  const count = await prisma.place.count({
    where: {
      id,
    },
  });

  if (count === 0) {
    throw new HTTPException(Error.NOT_FOUND, {message:'No place with this id exists'});
  }
};
