import { isProtectedRoute } from "~/server/utils";
import useRedis from "../utils/redis";

const PROTECTED_ROUTES: ProtectedRoute[] = [
  "/api/recommends",
  /^\/api\/playlist(\/)?[^/]+$/,
  "/api/me",
  "/api/me/friends",
  /^\/api\/me\/friends(\/)?[^/]+$/,
  /^\/api\/friend-requests/,
];

export default defineEventHandler(async (event) => {
  if (!isProtectedRoute(event, PROTECTED_ROUTES)) return;

  const sessionId = getCookie(event, "session_id");
  console.log("session", sessionId);
  if (!sessionId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Not logged in",
    });
  }

  const env = useRuntimeConfig(event);
  const redis = await useRedis(env);
  const session = await redis.hGetAll<RedisUserSession>(sessionId);
  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid or expired session",
    });
  }

  event.context.session = session;
});
