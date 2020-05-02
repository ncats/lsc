// prettier-ignore
module.exports = {
  rest: {
    port: +(process.env.API_PORT || 8000),
    host: process.env.API_HOST || '0.0.0.0',
    openApiSpec: {
      setServersFromRequest: true,
    },
    listenOnStart: false,
  },
  services: {
    auth: {
      authUrl: process.env.SERVICES_AUTH_URL || 'https://a-ci.labshare.org/_api',
      tenant: process.env.SERVICES_AUTH_TENANT 
    },
    log: {
      enableMetadata: true
    },
    notifications: {
      email: {
        type:process.env.SERVICES_NOTIFICATIONS_EMAIL_TYPE || 'smtp',
        settings: {
          defaultFromEmail: process.env.SERVICES_NOTIFICATIONS_EMAIL_USER,
          service: process.env.SERVICES_NOTIFICATIONS_EMAIL_SERVICE || 'gmail',
          auth: {
            user: process.env.SERVICES_NOTIFICATIONS_EMAIL_USER,
            pass: process.env.SERVICES_NOTIFICATIONS_EMAIL_PASSWORD,
          },
        },
      }
    },
    cache: {
      type: process.env.SERVICES_NOTIFICATIONS_CACHE_TYPE || 'memory',
      memory:{
        isGlobalCache:true
      }
  
    },
  },
  <%= appNameCamelCase %>: {
    basePath:'/',
    test: 'TEST',
    email:{
      to: process.env.TEMPLATE_EMAIL_TO
    },
    db:{
      name: "ApiDS",
      connector: "memory",
      localStorage: "",
      file: ""
    }
  }
};
