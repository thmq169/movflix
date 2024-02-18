import publicClient from "../client/publicClient";

const personEndpoints = {
  detail: ({ personId }) => `person/${personId}`,
  medias: ({ personId }) => `person/${personId}/medias`,
};

const personApi = {
  getPersonDetail: async ({ personId }) => {
    try {
      const response = await publicClient.get(
        personEndpoints.detail({ personId })
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },
  getMedias: async ({ personId }) => {
    try {
      const response = await publicClient.get(
        personEndpoints.medias({ personId })
      );

      return { response };
    } catch (error) {
      return { error };
    }
  },
};

export default personApi;
