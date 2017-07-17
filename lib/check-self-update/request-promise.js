const tiny = require('tiny-json-http');

const requestPromise = (url) => {
  return new Promise((resolve, reject) => {
    tiny.get({url}, function(err, data){
      if (err) {
        reject(err)
      } else {
        resolve(data.body)
      }
    })
  })
}

module.exports = requestPromise;
