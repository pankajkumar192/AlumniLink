import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Users, Clock, Loader2, PlusCircle, Sparkles, ImagePlus } from "lucide-react";
import { eventAPI, uploadAPI, aiAPI } from "../utils/api";
import useAuthStore from "../store/authStore";
import ImageCropper from "../components/ImageCropper";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState(null);
  const [showHostModal, setShowHostModal] = useState(false);
  const [isHosting, setIsHosting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    title: "", description: "", date: "", location: "", eventType: "networking", capacity: "", image: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const fileInputRef = React.useRef(null);

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
        setFormData((prev) => ({ ...prev, image: res.data.url }));
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const user = useAuthStore((state) => state.user);

  const fetchEvents = async () => {
    try {
      const { data } = await eventAPI.getEvents();
      setEvents(data.data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleRegister = async (id) => {
    try {
      setRegisteringId(id);
      await eventAPI.registerForEvent(id);
      await fetchEvents();
    } catch (error) {
      console.error("Error registering for event:", error);
      alert(error.response?.data?.message || "Error registering for event");
    } finally {
      setRegisteringId(null);
    }
  };

  const handleHostEvent = async (e) => {
    e.preventDefault();
    setIsHosting(true);
    try {
      await eventAPI.createEvent({
        ...formData,
        capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
      });
      setShowHostModal(false);
      setFormData({ title: "", description: "", date: "", location: "", eventType: "networking", capacity: "", image: "" });
      fetchEvents();
    } catch (error) {
      console.error("Error hosting event:", error);
      alert(error.response?.data?.message || "Error hosting event");
    } finally {
      setIsHosting(false);
    }
  };

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    try {
      const { data } = await aiAPI.generateText(formData.title, "event");
      setFormData(prev => ({ ...prev, description: data.data }));
    } catch (error) {
      console.error("Error generating text:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const itemVariants = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } };

  return (
    <motion.div className="space-y-10" variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={itemVariants} className="glass-card p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 blur-3xl -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-3 tracking-tight">
              Alumni <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Events</span>
            </h1>
            <p className="text-gray-400 text-lg">Connect with your community at upcoming alumni gatherings.</p>
          </div>
          {user?.role !== "student" && (
            <motion.button
              onClick={() => setShowHostModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-7 py-3.5 rounded-2xl font-bold transition-all shadow-glow-primary hover:shadow-glow-secondary shrink-0"
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            >
              <PlusCircle className="w-5 h-5" />
              Host an Event
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Events Grid */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" variants={containerVariants}>
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
            <p className="text-gray-500 text-sm">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="col-span-full glass-card p-20 text-center flex flex-col items-center gap-4 border border-white/5">
            <Sparkles className="w-12 h-12 text-gray-500 opacity-20" />
            <h3 className="text-xl font-bold text-gray-300">No Upcoming Events</h3>
            <p className="text-gray-500">Check back later or host your own event.</p>
          </div>
        ) : events.map((event) => {
          const hasRegistered = event.attendees?.some(att => att.userId === (user?.id || user?.id));
          const isFull = event.capacity && event.attendees?.length >= event.capacity;
          const eventDate = new Date(event.date);

          return (
            <motion.div
              key={event.id}
              className="glass-card overflow-hidden group flex flex-col border border-white/5 hover:border-blue-500/25 transition-all duration-500"
              variants={itemVariants}
              whileHover={{ y: -6 }}
            >
              {/* Image */}
              <div className="relative h-52 bg-gradient-to-br from-blue-500/40 to-indigo-500/40 overflow-hidden shrink-0">
                <motion.img
                  src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop"}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                
                {/* Date Badge */}
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md border border-white/20 rounded-2xl px-3 py-2 text-center min-w-[52px]">
                  <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">{eventDate.toLocaleString("default", { month: "short" })}</p>
                  <p className="text-2xl font-black text-white leading-none">{eventDate.getDate()}</p>
                </div>

                <span className="absolute top-4 right-4 text-xs bg-white/15 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 rounded-full font-semibold capitalize">
                  {event.eventType}
                </span>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-lg font-bold text-white drop-shadow-lg leading-tight">{event.title}</h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4 flex flex-col flex-1">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="truncate">{eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Users className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>{event.attendees?.length || 0}{event.capacity ? ` / ${event.capacity}` : ''} going</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 flex-1">{event.description}</p>

                <motion.button
                  onClick={() => handleRegister(event.id)}
                  disabled={registeringId === event.id || hasRegistered || isFull}
                  className={`w-full font-bold py-3.5 rounded-xl transition-all flex items-center justify-center text-sm ${
                    hasRegistered
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 cursor-not-allowed"
                      : isFull
                      ? "bg-red-500/15 text-red-400 border border-red-500/25 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-glow-primary"
                  }`}
                  whileHover={(hasRegistered || isFull) ? {} : { scale: 1.02 }}
                  whileTap={(hasRegistered || isFull) ? {} : { scale: 0.98 }}
                >
                  {registeringId === event.id ? <Loader2 className="w-5 h-5 animate-spin" /> : hasRegistered ? "Registered ✓" : isFull ? "Sold Out" : "Reserve Spot"}
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Host Event Modal */}
      <AnimatePresence>
        {showHostModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto border border-white/10 shadow-premium-hover"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">Host a New Event</h2>
                  <p className="text-gray-400 text-sm mt-1">Fill in the details below to publish your event.</p>
                </div>
                <button onClick={() => setShowHostModal(false)} className="text-gray-400 hover:text-white transition bg-white/5 hover:bg-red-500/20 hover:text-red-400 p-2.5 rounded-xl">✕</button>
              </div>

              <form onSubmit={handleHostEvent} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Event Title</label>
                  <input required type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="input-focus w-full border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-gray-600" placeholder="e.g. Annual Tech Alumni Meetup" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Event Banner Image</label>
                  <div className="flex items-center gap-4">
                    {formData.image && (
                      <img src={formData.image} alt="Preview" className="h-16 w-32 object-cover rounded-xl border border-white/10" />
                    )}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-xl transition font-medium"
                    >
                      {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
                      {formData.image ? "Change Image" : "Upload Image"}
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleFileSelect}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Date & Time</label>
                    <input required type="datetime-local" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="input-focus w-full border border-white/10 rounded-2xl px-4 py-3 text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Location</label>
                    <input required type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="input-focus w-full border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-gray-600" placeholder="e.g. Main Campus Hall" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Event Type</label>
                    <select value={formData.eventType} onChange={(e) => setFormData({ ...formData, eventType: e.target.value })} className="input-focus w-full bg-[#111] border border-white/10 rounded-2xl px-4 py-3 text-white">
                      <option value="networking">Networking</option>
                      <option value="workshop">Workshop</option>
                      <option value="seminar">Seminar</option>
                      <option value="reunion">Reunion</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Capacity (Optional)</label>
                    <input type="number" min="1" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} className="input-focus w-full border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-gray-600" placeholder="e.g. 200" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-300">Description</label>
                    <button
                      type="button"
                      onClick={handleAIGenerate}
                      disabled={isGenerating || !formData.title}
                      className="text-xs font-bold bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 text-blue-300 hover:text-white hover:bg-blue-500/40 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition disabled:opacity-50"
                    >
                      {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      Write with AI
                    </button>
                  </div>
                  <textarea required rows="4" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-focus w-full border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-gray-600 resize-none" placeholder="Describe the event..." />
                </div>
                <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
                  <button type="button" onClick={() => setShowHostModal(false)} className="px-6 py-3 rounded-xl text-gray-300 hover:bg-white/10 transition font-semibold border border-transparent hover:border-white/10">Cancel</button>
                  <motion.button type="submit" disabled={isHosting} className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition flex items-center gap-2 shadow-glow-primary" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    {isHosting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Publish Event"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Image Cropper Modal */}
      {cropImageSrc && (
        <ImageCropper
          imageSrc={cropImageSrc}
          aspect={16 / 9}
          onCancel={() => setCropImageSrc(null)}
          onCropComplete={handleCroppedImageUpload}
        />
      )}
    </motion.div>
  );
};

export default Events;
