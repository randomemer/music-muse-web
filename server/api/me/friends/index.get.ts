import { eq } from "drizzle-orm";
import { alias } from "drizzle-orm/mysql-core";
import { userFriends, users } from "~/server/database/schema";

export default defineEventHandler(async (event) => {
  const { user_id }: RedisUserSession = event.context.session;
  const env = useRuntimeConfig();
  const db = await useDrizzle(env);

  const friendsTable = alias(users, "friends");
  const result = await db
    .select()
    .from(userFriends)
    .leftJoin(friendsTable, eq(userFriends.friendId, friendsTable.id))
    .where(eq(userFriends.userId, user_id));

  const friends = result.map(({ friends }) => friends!);
  return friends;
});
