import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import {
  InsertFriendRequestModel,
  friendRequests,
} from "~/server/database/schema";

export default defineEventHandler(async (event) => {
  const session: RedisUserSession = event.context.session;
  const senderId = session.user_id;
  const body: FriendReqInput = await readBody(event);
  const recipientId = body.recipient;

  const config = useRuntimeConfig();
  const db = await useDrizzle(config);

  // Check 1 : Existence of recipient
  const recipientUser = await db.query.users.findFirst({
    where: (fields, { eq }) => eq(fields.id, recipientId),
  });
  if (!recipientUser) {
    throw createError({
      statusCode: 400,
      statusMessage: "This user doesn't exist",
    });
  }

  // Check 2 : Already friended
  const friendship = await db.query.userFriends.findFirst({
    where: (fields, { and, eq }) =>
      and(eq(fields.userId, senderId), eq(fields.friendId, recipientId)),
  });
  if (!!friendship) {
    throw createError({
      statusCode: 400,
      statusMessage: "This user is already friended",
    });
  }

  // Check 3 : Duplicate friend request
  const [userOne, userTwo] = _.orderBy([senderId, recipientId]);
  const existingRequest = await db.query.friendRequests.findFirst({
    where: (fields, { and, eq }) =>
      and(eq(fields.userOne, userOne), eq(fields.userTwo, userTwo)),
  });

  if (!!existingRequest) {
    throw createError({
      statusCode: 400,
      statusMessage: "Duplicate friend request",
    });
  }

  const data: InsertFriendRequestModel = {
    id: uuidv4(),
    userOne,
    userTwo,
    requestor: userOne == senderId ? "user1" : "user2",
  };
  const result = await db.insert(friendRequests).values(data);
  console.log("Created friend request", result);

  return data;
});
