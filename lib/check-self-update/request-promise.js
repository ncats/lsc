const tiny = require('tiny-json-http');

const requestPromise = (url) => {
  return new Promise((resolve, reject) => {
    tiny.get(url, function(err, data, body){
      if (err) {
        reject(err)
      }
      resolve(body)
    })
  })
}

module.exports = requestPromise;
