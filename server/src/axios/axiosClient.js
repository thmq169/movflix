const axios = require("axios");

const get = async (url) => {
  const reponse = await axios.get(url, {
    headers: {
      Accept: "application/json",
      "Accept-Encoding": "identity",
    },
  });
  return reponse.data;
};

module.exports = { get };
