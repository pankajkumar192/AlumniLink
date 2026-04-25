import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, MessageSquare, Clock, Search, MoreVertical, SearchX } from "lucide-react";
import useAuthStore from "../store/authStore";
import useChatStore from "../store/chatStore";
import { format } from "date-fns";

const Messages = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const {
    connectSocket,
    disconnectSocket,
    fetchConversations,
    conversations,
    activeConversation,
    setActiveConversation,
    messages,
    sendMessage,
    setTyping,
    isLoading
  } = useChatStore();

  const [messageText, setMessageText] = useState("");
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (token) {
      connectSocket(token);
      fetchConversations();
    }
    return () => disconnectSocket();
  }, [token, connectSocket, disconnectSocket, fetchConversations]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !activeConversation) return;

    sendMessage(messageText, activeConversation.otherUser.id);
    setMessageText("");
    setTyping(false);
  };

  const handleTyping = (e) => {
    setMessageText(e.target.value);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    } else {
      setTyping(true);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false);
      typingTimeoutRef.current = null;
    }, 2000);
  };

  const filteredConversations = conversations.filter(c => 
    c.otherUser?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-8rem)] glass-card flex overflow-hidden border border-white/5 shadow-premium">
      
      {/* Sidebar: Conversations List */}
      <div className={`w-full md:w-80 flex-shrink-0 flex flex-col border-r border-white/5 ${activeConversation ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-5 border-b border-white/5 bg-white/[0.02]">
          <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Messages</h2>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {isLoading && !conversations.length ? (
            <div className="p-8 flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500 flex flex-col items-center gap-2">
              <SearchX className="w-8 h-8 opacity-20" />
              <p className="text-sm">No conversations found.</p>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isUnread = conv.lastMessage && !conv.lastMessage.isRead && conv.lastMessage.senderId !== user.id;
              
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConversation(conv)}
                  className={`p-4 border-b border-white/5 flex gap-3 cursor-pointer transition-all hover:bg-white/5 ${activeConversation?.id === conv.id ? "bg-blue-500/[0.08] border-l-2 border-l-blue-500" : ""}`}
                >
                  <div className="relative shrink-0">
                    <img src={conv.otherUser.avatar || "https://i.pravatar.cc/150?img=1"} alt={conv.otherUser.name} className="w-12 h-12 rounded-full object-cover border border-white/10" />
                    {isUnread && <div className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-[#111]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className={`text-sm truncate ${isUnread ? "font-bold text-white" : "font-semibold text-gray-200"}`}>
                        {conv.otherUser.name}
                      </h3>
                      {conv.lastMessage && (
                        <span className="text-[10px] text-gray-500 shrink-0 ml-2">
                          {format(new Date(conv.lastMessage.createdAt), "HH:mm")}
                        </span>
                      )}
                    </div>
                    <p className={`text-xs truncate ${isUnread ? "text-blue-300 font-medium" : "text-gray-500"}`}>
                      {conv.lastMessage ? conv.lastMessage.content : "No messages yet"}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col ${!activeConversation ? 'hidden md:flex' : 'flex'}`}>
        {!activeConversation ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-black/20 p-8">
            <MessageSquare className="w-16 h-16 opacity-10 mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">Your Messages</h3>
            <p className="text-sm">Select a conversation from the sidebar to start chatting.</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-white/5 bg-white/[0.02] flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setActiveConversation(null)}
                  className="md:hidden p-2 -ml-2 text-gray-400 hover:text-white"
                >
                  ←
                </button>
                <img src={activeConversation.otherUser.avatar || "https://i.pravatar.cc/150?img=1"} alt={activeConversation.otherUser.name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                <div>
                  <h3 className="font-bold text-white text-sm">{activeConversation.otherUser.name}</h3>
                  <p className="text-xs text-gray-400 capitalize">{activeConversation.otherUser.role.toLowerCase()}</p>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4 bg-gradient-to-b from-transparent to-black/20">
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <p className="text-sm">Say hi to {activeConversation.otherUser.name}!</p>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isMine = msg.senderId === user.id;
                  const showTime = idx === 0 || new Date(msg.createdAt).getTime() - new Date(messages[idx-1].createdAt).getTime() > 5 * 60 * 1000;
                  
                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={msg.id} 
                      className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
                    >
                      {showTime && (
                        <div className="text-[10px] font-medium text-gray-600 mb-2 mt-4 px-2 tracking-widest uppercase">
                          {format(new Date(msg.createdAt), "MMM d, HH:mm")}
                        </div>
                      )}
                      <div 
                        className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          isMine 
                            ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-br-sm shadow-glow-primary" 
                            : "bg-white/10 text-gray-100 rounded-bl-sm border border-white/5"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </motion.div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/5 bg-white/[0.02]">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  placeholder={`Message ${activeConversation.otherUser.name}...`}
                  value={messageText}
                  onChange={handleTyping}
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all"
                />
                <motion.button
                  type="submit"
                  disabled={!messageText.trim()}
                  className="bg-blue-600 hover:bg-blue-500 disabled:bg-white/5 disabled:text-gray-500 disabled:cursor-not-allowed text-white w-12 rounded-xl flex items-center justify-center transition-all shadow-glow-primary"
                  whileTap={messageText.trim() ? { scale: 0.95 } : {}}
                >
                  <Send className="w-5 h-5 ml-1" />
                </motion.button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Messages;
