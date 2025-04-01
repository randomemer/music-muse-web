import axios from "axios";

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const query = getQuery(event);

    // 1. Fetch tokens
    const encoded = Buffer.from(
      `${config.spotifyClientId}:${config.spotifyClientSecret}`
    ).toString("base64");

    const formData = new URLSearchParams({
      grant_type: "authorization_code",
      code: `${query.code?.toString()}`,
      redirect_uri: `${config.public.origin}/auth/callback`,
    });

    const tokenResp = await axios.post<AccessTokenResponse>(
      `https://accounts.spotify.com/api/token`,
      formData.toString(),
      {
        headers: {
          Authorization: `Basic ${encoded}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // 2. Create a new session and save tokens to data store
    const kvSession = await createSession(event, config, tokenResp.data);
    const expiry = Date.now() + tokenResp.data.expires_in * 1000;

    return {
      token: {
        access_token: tokenResp.data.access_token,
        expiry,
      },
      redis_data: kvSession,
    } satisfies UserSession;
  } catch (error) {
    throw error;
  }
});
