const favoriteUtils = {
  check: ({ listFavorites, mediaId }) =>
    listFavorites &&
    listFavorites.find((f) => f.mediaId.toString() === mediaId.toString()) !==
      undefined,
};

export default favoriteUtils;
