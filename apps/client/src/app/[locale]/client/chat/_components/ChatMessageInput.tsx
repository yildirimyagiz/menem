"use client";

import { motion } from "framer-motion";
import { AtSign, Send, Tag } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface ChatMessageInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

export const ChatMessageInput = ({ 
  onSendMessage, 
  placeholder = "Type a message...", 
  disabled = false,
  isLoading = false 
}: ChatMessageInputProps) => {
  const [message, setMessage] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionType, setSuggestionType] = useState<"hashtag" | "mention" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock suggestions - in real app, these would come from API
  const hashtagSuggestions = ["#support", "#help", "#property", "#rent", "#sale"];
  const mentionSuggestions = ["@admin", "@support", "@agent", "@manager"];

  const handleSend = () => {
    if (!message.trim() || disabled || isLoading) return;
    onSendMessage(message.trim());
    setMessage("");
    setShowSuggestions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);

    // Check for hashtag or mention suggestions
    const lastWord = value.split(" ").pop() || "";
    if (lastWord.startsWith("#")) {
      setSuggestionType("hashtag");
      setShowSuggestions(true);
    } else if (lastWord.startsWith("@")) {
      setSuggestionType("mention");
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const insertSuggestion = (suggestion: string) => {
    const words = message.split(" ");
    words[words.length - 1] = suggestion;
    setMessage(words.join(" ") + " ");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const addHashtag = () => {
    setMessage(prev => prev + " #");
    inputRef.current?.focus();
  };

  const addMention = () => {
    setMessage(prev => prev + " @");
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full px-4 py-3 border border-blue-200/50 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-blue-900 placeholder-blue-400 disabled:opacity-50"
          />
          
          {/* Quick Action Buttons */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={addMention}
              className="p-1 rounded text-blue-600 hover:bg-blue-100"
              title="Mention someone"
            >
              <AtSign className="h-4 w-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={addHashtag}
              className="p-1 rounded text-blue-600 hover:bg-blue-100"
              title="Add hashtag"
            >
              <Tag className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
        
        <motion.button
          onClick={handleSend}
          disabled={!message.trim() || disabled || isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
            message.trim() && !disabled && !isLoading
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-blue-500/25"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
            />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </motion.button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg border border-gray-200 shadow-lg z-50"
        >
          <div className="p-2">
            <div className="text-xs text-gray-500 mb-2">
              {suggestionType === "hashtag" ? "Hashtag suggestions:" : "Mention suggestions:"}
            </div>
            <div className="space-y-1">
              {(suggestionType === "hashtag" ? hashtagSuggestions : mentionSuggestions).map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => insertSuggestion(suggestion)}
                  className="w-full text-left px-3 py-2 rounded hover:bg-blue-50 text-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}; 