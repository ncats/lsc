module.exports = {
  test: process.env.TEST_VAL,
  production: false,
  services: {
    auth: {
      authFlowType: 'code',
      url: process.env.SERVICES_AUTH_URL,
      clientId: process.env.SERVICES_AUTH_CLIENT_ID,
      tenant: process.env.SERVICES_AUTH_TENANT
    },
    logging: {
      url: process.env.SERVICES_LOG_URL,
      application: process.env.SERVICES_LOG_APP,
      environment: process.env.SERVICES_LOG_ENV,
      subTag: process.env.SERVICES_LOG_TAG
    }
  }
};
