import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Heart, Share2, Image as ImageIcon, Send, Loader2, ImagePlus, Globe } from "lucide-react";
import { postAPI, uploadAPI } from "../utils/api";
import useAuthStore from "../store/authStore";
import ImageCropper from "../components/ImageCropper";
import { formatDistanceToNow } from "date-fns";

const Community = () => {
  const user = useAuthStore((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Create Post State
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [postImage, setPostImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  
  // Image Cropper
  const fileInputRef = useRef(null);
  const [cropImageSrc, setCropImageSrc] = useState(null);

  // Comment State
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);

  const fetchPosts = async () => {
    try {
      const { data } = await postAPI.getPosts();
      setPosts(data.data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result);
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  const handleCroppedImageUpload = async (croppedFile) => {
    setCropImageSrc(null);
    setIsUploading(true);
    try {
      const data = new FormData();
      data.append("image", croppedFile);
      const res = await uploadAPI.uploadImage(data);
      if (res.data.success) {
        setPostImage(res.data.url);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!content.trim() && !postImage) return;
    setIsPosting(true);
    try {
      await postAPI.createPost({ content, image: postImage });
      setContent("");
      setPostImage("");
      await fetchPosts();
    } catch (error) {
      console.error("Error creating post:", error);
      alert(error.response?.data?.message || "Error posting");
    } finally {
      setIsPosting(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      // Optimistic Update
      setPosts(posts.map(p => {
        if (p.id === postId) {
          const hasLiked = p.likes.some(l => l.userId === user.id);
          return {
            ...p,
            likes: hasLiked ? p.likes.filter(l => l.userId !== user.id) : [...p.likes, { userId: user.id }]
          };
        }
        return p;
      }));
      await postAPI.toggleLike(postId);
    } catch (error) {
      console.error("Error liking post:", error);
      fetchPosts(); // Revert on error
    }
  };

  const handleAddComment = async (postId) => {
    if (!commentText.trim()) return;
    setIsCommenting(true);
    try {
      await postAPI.addComment(postId, commentText);
      setCommentText("");
      setActiveCommentId(null);
      await fetchPosts();
    } catch (error) {
      console.error("Error adding comment:", error);
      alert(error.response?.data?.message || "Error adding comment");
    } finally {
      setIsCommenting(false);
    }
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <motion.div className="max-w-3xl mx-auto space-y-8 pb-20" variants={containerVariants} initial="hidden" animate="visible">
      
      <motion.div variants={itemVariants} className="glass-card p-8 relative overflow-hidden text-center sm:text-left">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl -mr-20 -mt-20" />
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight flex items-center justify-center sm:justify-start gap-3 relative z-10">
          <Globe className="w-8 h-8 text-blue-400" />
          Community <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Feed</span>
        </h1>
        <p className="text-gray-400 text-sm relative z-10">Share updates, ask questions, and connect with your network.</p>
      </motion.div>

      {/* Create Post Widget */}
      <motion.div variants={itemVariants} className="glass-card p-6 border border-white/10">
        <div className="flex gap-4">
          <img src={user?.avatar || "https://i.pravatar.cc/150"} alt="User" className="w-12 h-12 rounded-full border border-white/10 shrink-0 object-cover" />
          <div className="flex-1 space-y-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`What's on your mind, ${user?.name?.split(' ')[0]}?`}
              className="w-full bg-transparent text-white placeholder-gray-500 resize-none focus:outline-none text-lg py-2 min-h-[60px]"
            />
            
            {postImage && (
              <div className="relative rounded-2xl overflow-hidden border border-white/10 group">
                <img src={postImage} alt="Post preview" className="w-full max-h-96 object-cover" />
                <button onClick={() => setPostImage("")} className="absolute top-3 right-3 bg-black/60 p-2 rounded-full hover:bg-red-500/80 transition text-white backdrop-blur-md opacity-0 group-hover:opacity-100">✕</button>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-medium text-sm px-3 py-1.5 rounded-lg hover:bg-blue-500/10"
              >
                {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                <span className="hidden sm:inline">Photo</span>
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect} />
              
              <motion.button
                onClick={handleCreatePost}
                disabled={isPosting || (!content.trim() && !postImage)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-full font-bold transition-all shadow-glow-primary disabled:opacity-50 flex items-center gap-2 text-sm"
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              >
                {isPosting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Post
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Feed */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-400" /></div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-gray-500 glass-card">No posts yet. Be the first to share something!</div>
        ) : posts.map((post) => {
          const hasLiked = post.likes.some(l => l.userId === user?.id);
          return (
            <motion.div key={post.id} variants={itemVariants} className="glass-card overflow-hidden border border-white/5">
              
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <img src={post.user?.avatar || "https://i.pravatar.cc/150"} alt={post.user?.name} className="w-12 h-12 rounded-full object-cover border border-white/10" />
                  <div>
                    <h3 className="font-bold text-white leading-tight flex items-center gap-2">
                      {post.user?.name}
                      {post.user?.isMentor && <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-md uppercase tracking-wider">Mentor</span>}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {post.user?.position || "Member"} {post.user?.company && `at ${post.user?.company}`} • {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>

                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">{post.content}</p>
              </div>

              {post.image && (
                <div className="w-full bg-[#0a0a0a] border-y border-white/5">
                  <img src={post.image} alt="Post" className="w-full max-h-[500px] object-contain" />
                </div>
              )}

              <div className="px-6 py-4 border-t border-white/5">
                <div className="flex items-center justify-between text-gray-400 text-sm mb-4">
                  <span>{post.likes.length} Likes</span>
                  <span>{post.comments.length} Comments</span>
                </div>
                
                <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition ${hasLiked ? "text-blue-400 bg-blue-500/10" : "hover:bg-white/5 hover:text-white"}`}
                  >
                    <Heart className={`w-5 h-5 ${hasLiked ? "fill-current" : ""}`} /> Like
                  </button>
                  <button 
                    onClick={() => setActiveCommentId(activeCommentId === post.id ? null : post.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium hover:bg-white/5 hover:text-white transition"
                  >
                    <MessageSquare className="w-5 h-5" /> Comment
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              <AnimatePresence>
                {activeCommentId === post.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: "auto", opacity: 1 }} 
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-black/20 border-t border-white/5 px-6 py-4"
                  >
                    <div className="flex gap-3 mb-6">
                      <img src={user?.avatar || "https://i.pravatar.cc/150"} alt="You" className="w-8 h-8 rounded-full border border-white/10 shrink-0 object-cover" />
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                          placeholder="Write a comment..."
                          className="w-full bg-white/5 border border-white/10 rounded-full pl-4 pr-12 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                        />
                        <button 
                          onClick={() => handleAddComment(post.id)}
                          disabled={isCommenting || !commentText.trim()}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-blue-400 hover:bg-blue-500/20 rounded-full transition disabled:opacity-50"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {post.comments.map(comment => (
                        <div key={comment.id} className="flex gap-3">
                          <img src={comment.user?.avatar || "https://i.pravatar.cc/150"} alt={comment.user?.name} className="w-8 h-8 rounded-full border border-white/10 shrink-0 object-cover" />
                          <div className="bg-white/5 px-4 py-2.5 rounded-2xl rounded-tl-sm text-sm border border-white/5 flex-1">
                            <h4 className="font-bold text-gray-200 mb-0.5">{comment.user?.name}</h4>
                            <p className="text-gray-300 leading-relaxed">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          );
        })}
      </div>

      {cropImageSrc && (
        <ImageCropper
          imageSrc={cropImageSrc}
          aspect={NaN}
          onCancel={() => setCropImageSrc(null)}
          onCropComplete={handleCroppedImageUpload}
        />
      )}
    </motion.div>
  );
};

export default Community;
