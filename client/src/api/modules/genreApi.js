import publicClient from "../client/publicClient";

const genreEndPoints = {
  list: ({ mediaType }) => `${mediaType}/genres`,
};

const genreApi = {
  getList: async ({ mediaType }) => {
    try {
      const response = await publicClient.get(
        genreEndPoints.list({ mediaType })
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },
};

export default genreApi;
