export default {
  port: 3000,
  log: {
    level: 'silly',
    disabled: false,
  },
  cors: {
    origins: ['http://localhost:5173'],
    maxAge: 3 * 60 * 60,
  },
  auth: {
    maxDelay: 5000,
    argon: {
      hashLength: 32,
      timeCost: 6,
      memoryCost: 2 ** 17,
    },
    jwt: {
      audience: 'budget.hogent.be',
      issuer: 'budget.hogent.be',
    },
  },
};