import getAdmin from "~/server/utils/firebase";

export default defineEventHandler(async (event) => {
  try {
    const env = useRuntimeConfig(event);
    const sessionId = getCookie(event, "session_id");

    if (!sessionId) return sendNoContent(event);

    const admin = getAdmin(env.serviceAccKey);
    const db = admin.firestore();

    await db.collection("sessions").doc(sessionId).delete();
    setCookie(event, "session_id", "", { maxAge: -1 });

    return sendNoContent(event);
  } catch (error) {
    console.error(error);
    throw error;
  }
});
