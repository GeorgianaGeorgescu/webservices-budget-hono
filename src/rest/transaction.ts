import * as transactionService from '../service/transaction';
import { Hono } from "hono";
import type { Context, Hono as HonoInstance } from 'hono';
import { requireAuthentication } from '../core/auth';
import { CreateTransactionRequest, CreateTransactionResponse, GetAllTransactionsReponse, GetTransactionByIdResponse, UpdateTransactionRequest, UpdateTransactionResponse } from '../types/transaction';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { HonoEnv } from '../types/hono';

const getAllTransactions = async (c: Context<HonoEnv>) => {
   const session = c.get('session');
   const transactions = await transactionService.getAll(session.userId,session.roles);
   return c.json<GetAllTransactionsReponse>({ items: transactions });
};

const createTransaction = async (c:Context<HonoEnv>) => {
   const session = c.get('session');
   const newTransaction = await c.req.json<CreateTransactionRequest>();
   const response= await transactionService.create( {
    ...newTransaction,
    userId: session.userId,
  })
   return c.json<CreateTransactionResponse>(response);
};
createTransaction.validationScheme = z.object({
    amount: z.number().gt(0),
    date: z.string().transform((val) => new Date(val)).pipe(z.date().max(new Date())),  
    placeId: z.number().int().positive(),
}).strict();

const getTransactionById = async (c : Context<HonoEnv>) => {
    const { id } = c.req.param(); 
    const session = c.get('session');
    const transaction = await transactionService.getById(Number(id),session.userId,session.roles);
    return c.json<GetTransactionByIdResponse>(transaction);
}
getTransactionById.validationScheme =z.object({
    id: z.coerce.number().int().positive(),
});

const updateTransaction = async (c : Context<HonoEnv>) => {
  const { id } = c.req.param();
  const session = c.get('session');
  const requestBody = await c.req.json<UpdateTransactionRequest>();
  const updatedTransaction = await transactionService.updateById(Number(id), {
    ...requestBody,
    userId: session.userId,
  });
  return c.json<UpdateTransactionResponse>(updatedTransaction); 
};
updateTransaction.validationScheme = z.object({
    amount: z.number().gt(0),
    date: z.string().transform((val) => new Date(val)).pipe(z.date().max(new Date())),   
    placeId: z.number().int().positive(),
}).strict();
updateTransaction.paramsScheme = z.object({
    id: z.coerce.number().int().positive()  
});

const deleteTransaction = async (c : Context<HonoEnv>) => {
    const { id } = c.req.param();
    const session = c.get('session');
    await transactionService.deleteById(Number(id),session.userId);
    return c.body(null, 204);
};
deleteTransaction.validationScheme =z.object({
    id: z.coerce.number().int().positive()
});

const installTransactionRoutes = (parent: HonoInstance) => {
    const router = new Hono();
    router.use(requireAuthentication);
    router.post( '/', zValidator('json', createTransaction.validationScheme),createTransaction);
    router.get('/',getAllTransactions);
    router.get('/:id', zValidator('param', getTransactionById.validationScheme),getTransactionById);
    router.put(
        '/:id',
        zValidator('param', updateTransaction.paramsScheme),
        zValidator('json', updateTransaction.validationScheme),updateTransaction
    );
    router.delete('/:id', zValidator('param', deleteTransaction.validationScheme),deleteTransaction);
   
    parent.route('/transactions', router);
};
  
export default installTransactionRoutes;