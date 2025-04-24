export const API_ENDPOINTS = {
  USER_REGISTRATION: '/api/register',
  USER_LOGIN: '/api/login',
  GET_USER_PROFILE: '/api/user/profile',
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
};

export const JWT_SECRET = 'your-jwt-secret-key';

export const OTP_EXPIRY_TIME = 300;

export const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const REDIS_CLIENT ='REDIS_CLIENT';

export const OTP_REPOSITORY = Symbol('OTP_REPOSITORY');


