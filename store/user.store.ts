import type { AxiosInstance } from "axios";
import _ from "lodash";
import { defineStore } from "pinia";
import type { UserModel } from "~/types/server";

const useUserStore = defineStore("auth", {
  state: () => {
    return {
      session: null,
      profile: null,
    } as UserState;
  },
  getters: {
    accessToken: (state) => state.session?.token.access_token,
    isTokenExpired: (state) =>
      !state.session?.token.expiry || state.session?.token.expiry <= Date.now(),
  },
  actions: {
    setSession(session: Partial<UserSession>) {
      this.session = _.merge(this.session, session);
    },
    setProfile(profile: Partial<UserModel>) {
      this.profile = _.merge(this.profile, profile);
    },
    async fetchProfile(api: AxiosInstance) {
      if (!this.session) throw new Error("No session in store");
      const resp = await api.get<APIGetUser>(
        `user/${this.session.redis_data.user_id}`
      );
      this.profile = resp.data;
      return resp.data;
    },
    // async fetchSpotifyProfile(spotify: AxiosInstance) {
    //   if (!this.session) throw new Error("No session in store");

    //   const resp = await spotify.get<SpotifyApi.CurrentUsersProfileResponse>(
    //     "/me"
    //   );

    //   this.spotifyProfile = resp.data;
    //   return resp.data;
    // },
  },
});

export default useUserStore;
