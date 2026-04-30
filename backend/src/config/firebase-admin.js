// Firebase Admin SDK configuration for AlumniLink Backend
// ============================================================
// SETUP INSTRUCTIONS:
//   1. In Firebase Console → Project Settings → Service Accounts
//   2. Click "Generate new private key" → downloads a JSON file
//   3. Add these values from the JSON to your backend .env:
//
//      FIREBASE_PROJECT_ID=your-project-id
//      FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
//      FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nXXX...\n-----END PRIVATE KEY-----\n"
//
//   (Wrap FIREBASE_PRIVATE_KEY in double quotes and keep the \n escape sequences)
// ============================================================

import admin from "firebase-admin";

const isConfigured = (val) => val && !val.startsWith("YOUR_");

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const rawKey = process.env.FIREBASE_PRIVATE_KEY;

  if (isConfigured(projectId) && isConfigured(clientEmail) && isConfigured(rawKey)) {
    const privateKey = rawKey.replace(/\\n/g, "\n");
    admin.initializeApp({
      credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
    });
    console.log("✅ Firebase Admin SDK initialized");
  } else {
    // Boot without Firebase – OAuth endpoints will return a 503
    admin.initializeApp({ projectId: "placeholder" });
    console.warn("⚠️  Firebase Admin SDK: Not configured. OAuth login is disabled.");
    console.warn("   Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in backend/.env");
  }
}

export default admin;
