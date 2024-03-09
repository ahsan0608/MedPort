const { expressjwt } = require("express-jwt")

const getTokenFromHeaders = (req: { headers: { authorization: string } }): string | null => {
  if (
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
  ) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

const auth = {
  required: expressjwt({
    secret: process.env.JWT_SECRET || 'superSecret',
    getToken: getTokenFromHeaders,
    algorithms: ['HS256'],
    requestProperty: 'user',
  }),
  optional: expressjwt({
    secret: process.env.JWT_SECRET || 'superSecret',
    credentialsRequired: false,
    getToken: getTokenFromHeaders,
    algorithms: ['HS256'],
    requestProperty: 'user',
  }),
};

export default auth;
