import React from "react";
import { motion } from "framer-motion";
import { User, Settings, LogOut } from "lucide-react";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { authAPI, uploadAPI } from "../utils/api";
import { Loader2, Upload } from "lucide-react";
import ImageCropper from "../components/ImageCropper";

const Profile = () => {
  const user = useAuthStore((state) => state.user);
  const getMe = useAuthStore((state) => state.getMe);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: user?.name || "",
    bio: user?.bio || "",
    phone: user?.phone || "",
    company: user?.company || "",
    position: user?.position || "",
    avatar: user?.avatar || "",
  });
  const [isUploading, setIsUploading] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [cropImageSrc, setCropImageSrc] = React.useState(null);
  const fileInputRef = React.useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result);
      // Reset input value so the same file can be selected again if needed
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  const handleCroppedImageUpload = async (croppedFile) => {
    setCropImageSrc(null); // Close cropper
    setIsUploading(true);
    try {
      const data = new FormData();
      data.append("image", croppedFile);
      
      const res = await uploadAPI.uploadImage(data);
      if (res.data.success) {
        setFormData((prev) => ({ ...prev, avatar: res.data.url }));
        // Also update backend immediately for avatar
        await authAPI.updateProfile({ avatar: res.data.url });
        // Update user in global store to reflect immediately everywhere
        await getMe();
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await authAPI.updateProfile(formData);
      setIsEditing(false);
      alert("Profile updated successfully! Please login again or refresh to see changes everywhere.");
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="space-y-8 max-w-3xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Profile Header */}
      <motion.div className="glass-card p-8" variants={itemVariants}>
        <div className="flex items-start gap-6 mb-6">
          <div className="relative group shrink-0">
            <img
              src={formData.avatar || user?.avatar || "https://i.pravatar.cc/150?img=1"}
              alt={user?.name}
              className="w-20 h-20 rounded-full border-2 border-blue-400 object-cover"
            />
            <div 
              className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading ? <Loader2 className="w-6 h-6 animate-spin text-white" /> : <Upload className="w-6 h-6 text-white" />}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileSelect}
            />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-1">{user?.name}</h1>
            <p className="text-gray-400 mb-4">{user?.role}</p>
            <div className="flex gap-3">
              <motion.button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm font-semibold"
                whileHover={{ scale: 1.05 }}
              >
                <Settings className="w-4 h-4" />
                {isEditing ? "Cancel" : "Edit Profile"}
              </motion.button>
              <motion.button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-semibold"
                whileHover={{ scale: 1.05 }}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Profile Info */}
      <motion.div className="glass-card p-8" variants={itemVariants}>
        <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditing}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={user?.email}
                disabled
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white disabled:opacity-50"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              disabled={!isEditing}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white disabled:opacity-50 min-h-24"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                disabled={!isEditing}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white disabled:opacity-50"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Position</label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              disabled={!isEditing}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white disabled:opacity-50"
            />
          </div>

          {isEditing && (
            <motion.button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold py-2.5 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Image Cropper Modal */}
      {cropImageSrc && (
        <ImageCropper
          imageSrc={cropImageSrc}
          aspect={1}
          onCancel={() => setCropImageSrc(null)}
          onCropComplete={handleCroppedImageUpload}
        />
      )}
    </motion.div>
  );
};

export default Profile;
