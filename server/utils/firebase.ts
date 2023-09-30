import admin from "firebase-admin";

export default function getAdmin(serviceAccKey: string) {
  if (admin.apps.length === 1) return admin;

  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(serviceAccKey)),
  });

  return admin;
}

export async function createUser(
  serviceAccKey: string,
  profile: SpotifyApi.CurrentUsersProfileResponse
) {
  const db = getAdmin(serviceAccKey).firestore();

  try {
    const docRef = db.doc(`users/${profile.id}`);
    const docData: UserDocument = {
      username: profile.id,
      display_name: profile.display_name ?? "",
      friends: [],
    };

    await docRef.create(docData);
  } catch (error) {
    if (!(error instanceof Error)) return;
    // Firebase does not provide an instance class to check the
    // error's instance type, hence using this hack instead
    if (error.message.includes("ALREADY_EXISTS")) return;
    throw error;
  }
}
