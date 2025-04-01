import { v4 as uuidv4 } from "uuid";
import { recommends } from "~/server/database/schema";
import { apiClientPrivate } from "~/server/utils/spotify";
import { getFullRecommendsData } from "~/utils/services";

export default defineEventHandler(async (event) => {
  const token: string = event.context.token;
  const { user_id }: RedisUserSession = event.context.session;
  const query = event.path.split("?").at(-1);

  if (!query) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid query",
    });
  }

  const spotifyApi = apiClientPrivate(token);

  // 1. Generate recommends
  const feedResp = await spotifyApi.get<SpotifyApi.RecommendationsObject>(
    `/recommendations?${query}`
  );

  // 2. Save to db
  const config = useRuntimeConfig(event);
  const db = await useDrizzle(config);

  const id = uuidv4();
  const result = await db.insert(recommends).values({
    id,
    userId: user_id,
    data: feedResp.data,
  });
  console.log("Saved recommend", result);

  // 3. Get complete data for recommends
  const data = await getFullRecommendsData(spotifyApi, feedResp.data);

  return { id, data };
});
