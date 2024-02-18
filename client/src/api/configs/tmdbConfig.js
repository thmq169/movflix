const mediaType = {
  movie: "movie",
  tv: "tv",
};

const mediaCategory = {
  popular: "popular",
  top_rated: "top_rated",
};

const backDropPath = (imageEndpoint) =>
  `https://image.tmdb.org/t/p/original${imageEndpoint}`;

const posterPath = (imageEndpoint) =>
  `https://image.tmdb.org/t/p/w500${imageEndpoint}`;

const youtubePath = (videoId) =>
  `https://www.youtube.com/embed/${videoId}?controls=0`;

export default {
  mediaCategory,
  mediaType,
  backDropPath,
  posterPath,
  youtubePath,
};
