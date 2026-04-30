// Firebase configuration for AlumniLink
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDw3FxeJEP17AnN9HvJ1qKxsccUO20_cus",
  authDomain: "alumnilink-8e1c2.firebaseapp.com",
  projectId: "alumnilink-8e1c2",
  storageBucket: "alumnilink-8e1c2.firebasestorage.app",
  messagingSenderId: "150176940823",
  appId: "1:150176940823:web:d7bb0a4273cadc873c6d52",
  measurementId: "G-X14YBKWJGT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export const githubProvider = new GithubAuthProvider();
githubProvider.addScope("read:user");
githubProvider.addScope("user:email");

// Helper: Sign in with popup and return the Firebase ID token
export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const idToken = await result.user.getIdToken();
  return { idToken, user: result.user, provider: "google" };
};

export const signInWithGithub = async () => {
  const result = await signInWithPopup(auth, githubProvider);
  const idToken = await result.user.getIdToken();
  return { idToken, user: result.user, provider: "github" };
};

export default app;
