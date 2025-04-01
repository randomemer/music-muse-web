import { and, eq, or } from "drizzle-orm";
import { userFriends } from "~/server/database/schema";

export default defineEventHandler(async (event) => {
  const { user_id }: RedisUserSession = event.context.session;
  const config = useRuntimeConfig();
  const db = await useDrizzle(config);

  const friendId = event.context.params?.id;
  if (!friendId) {
    throw createError({
      statusCode: 400,
      statusMessage: "No user ID was provided.",
    });
  }

  const result = await db
    .delete(userFriends)
    .where(
      or(
        and(
          eq(userFriends.userId, user_id),
          eq(userFriends.friendId, friendId)
        ),
        and(eq(userFriends.userId, friendId), eq(userFriends.friendId, user_id))
      )
    );

  console.log("Deleted request", result);
});
