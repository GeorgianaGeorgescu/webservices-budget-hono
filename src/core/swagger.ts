import { Hono } from 'hono';
import { swaggerUI } from '@hono/swagger-ui';

function generateOpenAPISpec() {
  return {
    openapi: '3.0.0',
    info: {
      title: 'Budget API',
      version: '1.0.0',
      description: 'API for webservices in Hono',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token for authentication'
        }
      },
      schemas: {
        Transaction: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            amount: { type: 'number', example: 29.99 },
            date: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00Z' },
            placeId: { type: 'integer', example: 123 },
            userId: { type: 'integer', example: 456 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        CreateTransactionRequest: {
          type: 'object',
          required: ['amount', 'date', 'placeId'],
          properties: {
            amount: { 
              type: 'number', 
              minimum: 0.01,
              description: 'Transaction amount (must be positive)',
              example: 29.99 
            },
            date: { 
              type: 'string', 
              format: 'date-time',
              description: 'Transaction date (cannot be in the future)',
              example: '2024-01-15T10:30:00Z'
            },
            placeId: { 
              type: 'integer',
              minimum: 1,
              description: 'ID of the place where transaction occurred',
              example: 123 
            }
          }
        },
        UpdateTransactionRequest: {
          type: 'object',
          properties: {
            amount: { 
              type: 'number', 
              minimum: 0.01,
              description: 'Transaction amount (must be positive)',
              example: 35.50 
            },
            date: { 
              type: 'string', 
              format: 'date-time',
              description: 'Transaction date (cannot be in the future)',
              example: '2024-01-15T10:30:00Z'
            },
            placeId: { 
              type: 'integer',
              minimum: 1,
              description: 'ID of the place where transaction occurred',
              example: 456 
            }
          }
        },
        GetAllTransactionsResponse: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/Transaction' }
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    },
    paths: {
      '/transactions': {
        get: {
          summary: 'Get all transactions',
          description: 'Retrieves all transactions for the authenticated user',
          tags: ['Transactions'],
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'List of transactions',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/GetAllTransactionsResponse' }
                }
              }
            },
            401: {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            }
          }
        },
        post: {
          summary: 'Create a new transaction',
          description: 'Creates a new transaction for the authenticated user',
          tags: ['Transactions'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateTransactionRequest' }
              }
            }
          },
          responses: {
            201: {
              description: 'Transaction created successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Transaction' }
                }
              }
            },
            400: {
              description: 'Invalid request data',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            },
            401: {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            }
          }
        }
      },
      '/transactions/{id}': {
        get: {
          summary: 'Get transaction by ID',
          description: 'Retrieves a specific transaction by its ID',
          tags: ['Transactions'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer', minimum: 1 },
              description: 'Transaction ID'
            }
          ],
          responses: {
            200: {
              description: 'Transaction details',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Transaction' }
                }
              }
            },
            404: {
              description: 'Transaction not found',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            },
            401: {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            }
          }
        },
        put: {
          summary: 'Update transaction',
          description: 'Updates an existing transaction',
          tags: ['Transactions'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer', minimum: 1 },
              description: 'Transaction ID'
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UpdateTransactionRequest' }
              }
            }
          },
          responses: {
            200: {
              description: 'Transaction updated successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Transaction' }
                }
              }
            },
            400: {
              description: 'Invalid request data',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            },
            404: {
              description: 'Transaction not found',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            },
            401: {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            }
          }
        },
        delete: {
          summary: 'Delete transaction',
          description: 'Deletes a transaction by ID',
          tags: ['Transactions'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer', minimum: 1 },
              description: 'Transaction ID'
            }
          ],
          responses: {
            204: {
              description: 'Transaction deleted successfully'
            },
            404: {
              description: 'Transaction not found',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            },
            401: {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Transactions',
        description: 'Transaction management operations'
      }
    ]
  };
}

export function installSwaggerRoutes(app: Hono) {

  app.get('/api-spec.json', (c) => {
    const spec = generateOpenAPISpec();
    return c.json(spec);
  });

  app.get('/docs', swaggerUI({ url: '/api-spec.json' }));
}