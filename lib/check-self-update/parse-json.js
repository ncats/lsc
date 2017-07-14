/* Sometimes, a json can be malformed. This ensures error-handling */

const parseJson = (string) => {
  try {
    return JSON.parse(string);
  } catch (error) {
    throw new Error(`Could not parse JSON data: ${error}`);
  }
}

module.exports = parseJson;
