import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { InsertUserModel, users } from "~/server/database/schema";

export default defineEventHandler(async (event) => {
  const env = useRuntimeConfig();
  const session: RedisUserSession = event.context.session;
  const db = await useDrizzle(env);

  try {
    const formData = await readMultipartFormData(event);
    if (!formData) return;

    const data = new Map();
    for (const field of formData) {
      // Upload to bucket and set URL
      if (field.name === "picture") {
        const ext = field.type?.split("/").at(-1);

        const url = await uploadObject(
          `images/${session.user_id}/${uuidv4()}.${ext}`,
          field.data,
          env.serviceAccKey,
          env.storageBucket
        );
        data.set(field.name, url);
      }
      if (field.name === "username") {
        data.set(field.name, field.data.toString("utf8"));
      }
    }

    if (data.size === 0) return;

    // Update database record
    const json: Partial<InsertUserModel> = Object.fromEntries(data.entries());
    const result = await db
      .update(users)
      .set(json)
      .where(eq(users.id, session.user_id));
    console.log("Updated user", result);

    return json;
  } catch (error) {
    console.error(error);
    if (!(error instanceof Error)) return;

    if (error.message.includes("NOT_FOUND")) {
      throw createError({
        statusCode: 404,
        statusMessage: "Document Not Found",
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
