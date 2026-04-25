import { registerUser, loginUser, generateToken, getUserProfile, updateUserProfile } from "../services/authService.js";

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
    const { name, bio, phone, company, position, yearsOfExperience, university, graduationYear, skills, interests, avatar } =
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

    const user = await updateUserProfile(req.user.id, updateData);

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { register, login, getMe, updateProfile };
