import * as placeService from '../service/place';
import { Hono } from "hono";
import type { Context, Hono as HonoInstance } from 'hono';
import { requireAuthentication } from '../core/auth';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { CreatePlaceRequest, CreatePlaceResponse, GetAllPlacesResponse, GetPlaceByIdResponse, UpdatePlaceRequest, UpdatePlaceResponse } from '../types/place';
import * as transactionService from '../service/transaction';
import { HonoEnv } from '../types/hono';
import { GetAllTransactionsReponse } from '../types/transaction';

const getAllPlaces = async (c: Context) => {
   const places = await placeService.getAll();
   return c.json<GetAllPlacesResponse>({ items: places });
};

const getPlaceById = async (c : Context) => {
    const { id } = c.req.param();
    const place = await placeService.getById(Number(id));
    return c.json<GetPlaceByIdResponse>(place);
}
getPlaceById.validationScheme =z.object({
    id: z.coerce.number().int().positive(),
});

const createPlace = async (c:Context) => {
   const newPlace = await c.req.json<CreatePlaceRequest>();
   const response= await placeService.create(newPlace);
   return c.json<CreatePlaceResponse>(response);
};
createPlace.validationScheme = z.object({
    name: z.string().max(255),
    rating: z.number().int().min(1).max(5).optional()
}).strict();

const updatePlace = async (c : Context) => {
  const { id } = c.req.param();
  const requestBody = await c.req.json<UpdatePlaceRequest>();
  const updatedPlace = await placeService.updateById(Number(id), requestBody);
  return c.json<UpdatePlaceResponse>(updatedPlace); 
};
updatePlace.validationScheme = z.object({
    name: z.string().max(255),
    rating: z.number().int().min(1).max(5).optional()
}).strict();
updatePlace.paramsScheme = z.object({
    id: z.coerce.number().int().positive()  
});

const deletePlace = async (c : Context) => {
    const { id } = c.req.param();
    await placeService.deleteById(Number(id));
    return c.body(null, 204);
};
deletePlace.paramsScheme =z.object({
    id: z.coerce.number().int().positive()
});

const getTransactionsByPlaceId = async (c : Context<HonoEnv>) => {
    const { id } = c.req.param();
    const session = c.get('session');
    const transactions = await transactionService.getTransactionsByPlaceId(Number(id), session.userId);
    return c.json<GetAllTransactionsReponse>({ items: transactions }); 
};
getTransactionsByPlaceId.paramsScheme =z.object({
    id: z.coerce.number().int().positive()
});


const installPlacesRoutes = (parent: HonoInstance) => {
    const router = new Hono();
    router.use(requireAuthentication);

    router.get('/', getAllPlaces);
    router.get('/:id',zValidator('param', getPlaceById.validationScheme),getPlaceById);
    router.post('/', zValidator('json', createPlace.validationScheme),createPlace);
    router.put(
        '/:id',
        zValidator('json', updatePlace.validationScheme),
        zValidator('param', updatePlace.paramsScheme),
        updatePlace
    );
    router.delete('/:id', zValidator('param', deletePlace.paramsScheme), deletePlace);
  
    router.get('/:id/transactions', getTransactionsByPlaceId);

    parent.route('/places', router);
};

export default installPlacesRoutes;