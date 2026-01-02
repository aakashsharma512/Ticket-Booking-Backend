const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

const DEFAULT_PORT = 5000;

const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test'
};

module.exports = {
  HTTP_STATUS,
  DEFAULT_PORT,
  ENVIRONMENTS
};

