const request = require('request');

const requestPromise = (url) => {
  return new Promise((resolve, reject) => {
    request(url, function(err, data, body){
      if (err) {
        reject(err)
      }
      resolve(body)
    })
  })
}

module.exports = requestPromise;
