"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";

// Import the enhanced chat with channels page
import { useTranslations } from 'next-intl';

export default function ChatPage() {
  const t = useTranslations('Chat');
  const EnhancedChatWithChannels = dynamic(() => import("./EnhancedChatWithChannels"), {
    ssr: false,
    loading: () => (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mb-4 h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"
          />
          <p className="text-sm text-blue-600">{t('loading', { defaultValue: 'Loading chat & channels...' })}</p>
        </motion.div>
      </div>
    ),
  });

  // Simple Footer Component
  const ChatFooter = () => (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-6 mt-auto"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">{t('footer.title', { defaultValue: 'Reservatior Chat' })}</h3>
            <p className="text-blue-200 text-sm">
              {t('footer.description', { defaultValue: 'Connect with agents and communities for better property management' })}
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-300">24/7</div>
              <div className="text-xs text-blue-200">{t('footer.support', { defaultValue: 'Support Available' })}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-300">500+</div>
              <div className="text-xs text-blue-200">{t('footer.activeUsers', { defaultValue: 'Active Users' })}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-300">4.9★</div>
              <div className="text-xs text-blue-200">{t('footer.rating', { defaultValue: 'Rating' })}</div>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-blue-700 text-center">
          <p className="text-blue-300 text-sm">
            {t('footer.copyright', { defaultValue: '© 2024 Reservatior. All rights reserved. | Privacy Policy | Terms of Service' })}
          </p>
        </div>
      </div>
    </motion.footer>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm border-b border-blue-200/30 py-4"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-900">{t('header.title', { defaultValue: 'Chat & Channels' })}</h1>
                <p className="text-sm text-blue-600">{t('header.description', { defaultValue: 'Connect with agents and communities' })}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg hover:bg-blue-100 text-blue-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM4 15h6v-2H4v2zM4 11h6V9H4v2zM4 7h6V5H4v2z" />
                </svg>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg hover:bg-blue-100 text-blue-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Chat Content - Centered */}
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-7xl h-[80vh] rounded-2xl overflow-hidden shadow-2xl border border-blue-200/30 bg-white/80 backdrop-blur-sm"
        >
          <EnhancedChatWithChannels />
        </motion.div>
      </div>

      {/* Footer */}
      <ChatFooter />
    </div>
  );
}

