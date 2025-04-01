import type { HTTPMethod } from "h3";

import type {
  FriendRequestModel,
  InsertFriendRequestModel,
  InsertPlaylistModel,
  InsertRecommendModel,
  InsertUserFriendModel,
  InsertUserModel,
  PlaylistModel,
  RecommendModel,
  UserFriendModel,
  UserModel,
} from "~/server/database/schema";

declare global {
  // Auth
  interface AccessTokenResponse {
    access_token: string;
    token_type: string;
    scope: string;
    expires_in: number;
    refresh_token: string;
  }

  interface BasicTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
  }

  interface RefreshedAccessTokenResponse {
    access_token: string;
    token_type: string;
    scope: string;
    expires_in: number;
  }

  interface RedisUserSession {
    user_id: string;
    refresh_token: string;
    created_at: number;
    updated_at: number;
  }

  interface AuthToken {
    access_token: string;
    expiry: number;
  }

  interface UserSession {
    token: AuthToken;
    redis_data: RedisUserSession;
  }

  type PathLike = string | RegExp;

  interface ProtectedRouteObject {
    path: PathLike;
    methods?: HTTPMethod[];
  }

  type ProtectedRoute = PathLike | ProtectedRouteObject;

  interface CreatePlaylistForm {
    user_id: string;
    name: string;
    public?: boolean | null;
    description?: string | null;
    tracks: string[];
    image?: File | null;
  }

  interface PatchProfileResponse {
    username: string;
    picture: string;
  }

  interface FriendReqInput {
    recipient: string;
  }

  interface APIGetUser extends UserModel {
    friends: number;
  }

  interface APIFriendRequest {
    id: string;
    createdAt: string;
    senderId: string;
    recipientId: string;
    sender: UserModel;
    recipient: UserModel;
  }
}

export {
  FriendRequestModel,
  InsertFriendRequestModel,
  InsertPlaylistModel,
  InsertRecommendModel,
  InsertUserFriendModel,
  InsertUserModel,
  PlaylistModel,
  RecommendModel,
  UserFriendModel,
  UserModel,
};
