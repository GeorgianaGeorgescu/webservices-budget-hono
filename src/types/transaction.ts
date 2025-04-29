import type { Entity, ListResponse } from './common';
import type { Place } from './place';
import type { User } from './user';

export interface Transaction extends Entity {
  amount: number;
  date: Date;
  user: Pick<User, 'id' | 'name'>;
  place: Pick<Place, 'id' | 'name'>;
}

export interface TransactionCreateInput {
  amount: number;
  date: Date;
  userId: number;
  placeId: number;
}

export interface TransactionUpdateInput extends TransactionCreateInput {}

export interface CreateTransactionRequest extends Omit<TransactionCreateInput, 'userId'> {}
export interface UpdateTransactionRequest extends Omit<TransactionUpdateInput, 'userId'> {}

export interface GetAllTransactionsReponse extends ListResponse<Transaction> {}
export interface GetTransactionByIdResponse extends Transaction {}
export interface CreateTransactionResponse extends GetTransactionByIdResponse {}
export interface UpdateTransactionResponse extends GetTransactionByIdResponse {}