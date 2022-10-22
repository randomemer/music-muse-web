export enum UserTopItemsSort {
  Long = "long_term",
  Medium = "medium_term",
  Short = "short_term",
}

export type SpotifySearchFilter = "track" | "artist" | "genre";

export type Seed = {
  seed: SpotifyApi.TrackObjectFull | SpotifyApi.ArtistObjectFull | string;
  type: SpotifySearchFilter;
};

export type AccountCookie = {
  user: SpotifyApi.CurrentUsersProfileResponse;
  refresh_token: string;
};

export type RecentlyPlayedTracks = SpotifyApi.CursorBasedPagingObject<
  SpotifyApi.PlayHistoryObject & { track: SpotifyApi.TrackObjectFull }
>;
