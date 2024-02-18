const getUrl = (endpoint, params) => {
  const queryString = new URLSearchParams(params);

  return `${process.env.TMDB_BASE_URL}/${endpoint}?api_key=${process.env.TMDB_SECRET}&${queryString}`;
};

module.exports = {
  getUrl,
};
