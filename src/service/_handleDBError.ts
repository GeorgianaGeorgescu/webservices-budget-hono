import { HTTPException } from 'hono/http-exception'
import { Error } from '../core/errors';

const handleDBError = (error: any) => {
  const { code = '', message } = error;

  if (code === 'P2002') {
    switch (true) {
      case message.includes('idx_place_name_unique'):
        throw new HTTPException(Error.VALIDATION_FAILED, { message: 'A place with this name already exists' });
      case message.includes('idx_user_email_unique'):
        throw new HTTPException(Error.VALIDATION_FAILED, { message: 'There is already a user with this email address' });
      default:
        throw new HTTPException(Error.VALIDATION_FAILED, { message: 'This item already exists' });
    }
  }

  if (code === 'P2025') {
    switch (true) {
      case message.includes('fk_transaction_user'):
        throw new HTTPException(Error.NOT_FOUND, { message: 'This user does not exist' });
      case message.includes('fk_transaction_place'):
        throw new HTTPException(Error.NOT_FOUND, { message: 'This place does not exist' });
      case message.includes('transaction'):
        throw new HTTPException(Error.NOT_FOUND, { message: 'No transaction with this id exists' });
      case message.includes('place'):
        throw new HTTPException(Error.NOT_FOUND, { message: 'No place with this id exists' });
      case message.includes('user'):
        throw new HTTPException(Error.NOT_FOUND, { message: 'No user with this id exists' });
    }
  }
  if (code === 'P2003') {
    switch (true) {
      case message.includes('place_id'):
        throw new HTTPException(Error.CONFLICT, { message: 'This place is still linked to transactions' });
      case message.includes('user_id'):
        throw new HTTPException(Error.CONFLICT, { message: 'This user is still linked to transactions' });
    }
  }

  throw error;
};

export default handleDBError;
