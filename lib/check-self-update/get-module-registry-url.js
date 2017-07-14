const registryUrl = 'http://registry.npmjs.org';

const getModuleRegistryUrl = (name) => {
  return [registryUrl, name].join('/')
}

module.exports = getModuleRegistryUrl;
