import { kv } from "@vercel/kv";
import axios from "axios";
import { setCookie, type H3Event } from "h3";
import type { RuntimeConfig } from "nuxt/schema";
import type {} from "spotify-web-api-js";
import getAdmin, { createUserIfNotExists } from "./firebase";

export async function createSession(
  event: H3Event,
  config: RuntimeConfig,
  tokenData: AccessTokenResponse
) {
  console.time("create-session");
  // 1. Get user data from spotify
  const userResp = await axios.get<SpotifyApi.CurrentUsersProfileResponse>(
    "https://api.spotify.com/v1/me",
    {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    }
  );
  const profile = userResp.data;

  // 2. Create a session in kv redis
  const ts = Date.now();
  const session = {
    user_id: profile.id,
    refresh_token: tokenData.refresh_token,
    created_at: ts,
    updated_at: ts,
  };
  const kvRes = await kv.set(profile.id, session);
  console.log("kvRes", kvRes);

  // 3. Set account info (if not present)
  const { serviceAccKey } = config;
  await createUserIfNotExists(serviceAccKey, profile);

  // 4. Set cookie with session details
  setCookie(event, "session_id", userResp.data.id, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60,
  });
  console.timeEnd("create-session");
}

export async function fetchSession(
  config: Record<string, string>,
  sessionId: string
) {
  if (!sessionId) {
    throw createError({ statusCode: 401, statusMessage: "User not logged in" });
  }

  // 1. fetch session
  console.time("kv");
  const session = await kv.get<UserSession>(sessionId);
  console.timeEnd("kv");

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: "User not logged in",
    });
  }

  // 2. fetch access token using session
  const encoded = Buffer.from(
    `${config.spotifyClientId}:${config.spotifyClientSecret}`
  ).toString("base64");

  const formData = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: session.refresh_token,
  });

  const tokenResp = await axios.post<RefreshedAccessTokenResponse>(
    `https://accounts.spotify.com/api/token`,
    formData.toString(),
    {
      headers: {
        Authorization: `Basic ${encoded}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return {
    access_token: tokenResp.data.access_token,
    expiry: Date.now() + tokenResp.data.expires_in * 1000,
  };
}
