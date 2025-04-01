import { eq } from "drizzle-orm";
import { H3Error } from "h3";
import { friendRequests } from "~/server/database/schema";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { user_id }: RedisUserSession = event.context.session;
  const db = await useDrizzle(config);

  const requestId = event.context.params?.id;
  if (!requestId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Friend request ID was provided",
    });
  }

  try {
    // Check 1 : Existence
    const request = await db.query.friendRequests.findFirst({
      where: (fields, { eq }) => eq(fields.id, requestId),
    });
    if (!request) {
      throw createError({
        statusCode: 404,
        statusMessage: "Friend request not found",
      });
    }
    console.log(request);

    // Check 2 : Ownership
    if (![request.userOne, request.userTwo].includes(user_id)) {
      throw createError({
        statusCode: 401,
        statusMessage: "Not authorized to perform this action",
      });
    }

    const result = await db
      .delete(friendRequests)
      .where(eq(friendRequests.id, requestId));
    console.log("Friend request deleted", result);
  } catch (error) {
    if (!(error instanceof Error)) return;
    if (error instanceof H3Error) throw error;

    console.error(error);

    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
