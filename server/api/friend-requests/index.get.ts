import { and, eq, or } from "drizzle-orm";
import { alias } from "drizzle-orm/mysql-core";
import { H3Error } from "h3";
import { friendRequests, users } from "~/server/database/schema";

type RequestDirection = "incoming" | "outgoing";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const direction = query.direction?.toString() || "incoming";
    const { user_id }: RedisUserSession = event.context.session;

    if (!["incoming", "outgoing"].includes(direction)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid query parameter : direction",
      });
    }

    const config = useRuntimeConfig();
    const db = await useDrizzle(config);

    const userOneModel = alias(users, "userOneModel");
    const userTwoModel = alias(users, "userTwoModel");
    const requests = await db
      .select()
      .from(friendRequests)
      .leftJoin(userOneModel, eq(friendRequests.userOne, userOneModel.id))
      .leftJoin(userTwoModel, eq(friendRequests.userTwo, userTwoModel.id))
      .where(
        or(
          and(
            eq(friendRequests.userOne, user_id),
            eq(
              friendRequests.requestor,
              direction === "incoming" ? "user2" : "user1"
            )
          ),
          and(
            eq(friendRequests.userTwo, user_id),
            eq(
              friendRequests.requestor,
              direction === "incoming" ? "user1" : "user2"
            )
          )
        )
      );

    const transformed = requests.map(
      ({ friend_requests: req, userOneModel, userTwoModel }) => {
        return {
          id: req.id,
          createdAt: req.createdAt,
          senderId: req.requestor === "user1" ? req.userOne : req.userTwo,
          recipientId: req.requestor === "user1" ? req.userTwo : req.userOne,
          sender: req.requestor === "user1" ? userOneModel : userTwoModel,
          recipient: req.requestor === "user1" ? userTwoModel : userOneModel,
        };
      }
    );

    return transformed;
  } catch (error) {
    if (error instanceof H3Error) throw error;

    console.error(error);

    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
