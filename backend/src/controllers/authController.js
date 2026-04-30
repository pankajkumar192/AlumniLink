import { registerUser, loginUser, generateToken, getUserProfile, updateUserProfile } from "../services/authService.js";
import admin from "../config/firebase-admin.js";
import prisma from "../config/database.js";

// Register
const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: "Please provide all required fields" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    // Register user
    const user = await registerUser(name, email, password, role || "STUDENT");

    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    // Login user
    const user = await loginUser(email, password);

    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    if (error.message === "Invalid credentials") {
      return res.status(401).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// OAuth Login (Google / GitHub via Firebase ID Token)
const oauthLogin = async (req, res) => {
  try {
    // Guard: Firebase not configured yet
    const projectId = process.env.FIREBASE_PROJECT_ID;
    if (!projectId || projectId.startsWith("YOUR_")) {
      return res.status(503).json({
        success: false,
        message: "OAuth is not configured on this server. Please set up Firebase Admin SDK credentials in backend/.env.",
      });
    }

    const { idToken, provider } = req.body;

    if (!idToken) {
      return res.status(400).json({ success: false, message: "Firebase ID token is required" });
    }

    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email not available from OAuth provider" });
    }

    // Find or create the user in our DB
    let user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      // First-time OAuth login – auto-create with STUDENT role (they can change in onboarding)
      user = await prisma.user.create({
        data: {
          name: name || email.split("@")[0],
          email: email.toLowerCase(),
          password: "", // No password for OAuth users
          role: "STUDENT",
          avatar: picture || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
          isVerified: true, // Email verified by the OAuth provider
        },
      });
    }

    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      isNewUser,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("OAuth login error:", error);
    if (error.code === "auth/id-token-expired") {
      return res.status(401).json({ success: false, message: "Session expired. Please sign in again." });
    }
    if (error.code === "auth/argument-error" || error.code === "auth/id-token-revoked") {
      return res.status(401).json({ success: false, message: "Invalid authentication token" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Current User
const getMe = async (req, res) => {
  try {
    const user = await getUserProfile(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Profile
const updateProfile = async (req, res) => {
  try {
    const { name, bio, phone, company, position, yearsOfExperience, university, graduationYear, skills, interests, avatar, role } =
      req.body;

    const updateData = {};

    if (name) updateData.name = name;
    if (bio) updateData.bio = bio;
    if (phone) updateData.phone = phone;
    if (company) updateData.company = company;
    if (position) updateData.position = position;
    if (yearsOfExperience) updateData.yearsOfExperience = yearsOfExperience;
    if (university) updateData.university = university;
    if (graduationYear) updateData.graduationYear = graduationYear;
    if (skills) updateData.skills = JSON.stringify(skills);
    if (interests) updateData.interests = JSON.stringify(interests);
    if (avatar) updateData.avatar = avatar;
    if (role) updateData.role = role.toUpperCase();

    const user = await updateUserProfile(req.user.id, updateData);

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { register, login, oauthLogin, getMe, updateProfile };
