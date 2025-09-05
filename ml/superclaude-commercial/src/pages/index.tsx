import Head from 'next/head'
import { useState } from 'react'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const isDev = process.env.NODE_ENV === 'development'

  return (
    <>
      <Head>
        <title>SuperClaude - AI Coding Assistant</title>
        <meta name="description" content="Professional AI coding assistant with local processing" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {!isDev && (
          <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' http://localhost:* https://localhost:*;" />
        )}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400">
        {/* Animated Glassmorphism overlay */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-white/60 backdrop-blur-lg transition-all duration-700" />
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 drop-shadow-xl md:text-6xl mb-4">
              <span>🚀 SuperClaude</span>
            </h1>
            <p className="text-xl text-gray-700 md:text-2xl mb-8">
              The Ultimate AI Coding Assistant
            </p>
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl ring-1 ring-blue-200 p-8 mb-8 transition-all duration-200 hover:scale-[1.02]">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  <div className="flex items-center space-x-3 p-4 rounded-lg bg-blue-50/50 hover:bg-blue-100/50 transition-colors">
                    <span className="text-green-500 text-xl">✓</span>
                    <span className="font-medium">Local AI Processing</span>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-lg bg-blue-50/50 hover:bg-blue-100/50 transition-colors">
                    <span className="text-green-500 text-xl">✓</span>
                    <span className="font-medium">Multiple Models</span>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-lg bg-blue-50/50 hover:bg-blue-100/50 transition-colors">
                    <span className="text-green-500 text-xl">✓</span>
                    <span className="font-medium">Context-Aware</span>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-lg bg-blue-50/50 hover:bg-blue-100/50 transition-colors">
                    <span className="text-green-500 text-xl">✓</span>
                    <span className="font-medium">Multi-Language Support</span>
                  </div>
                </div>
              </div>
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl ring-1 ring-blue-200 p-8 transition-all duration-200 hover:scale-[1.02]">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">Specialized Personas</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200/50 hover:shadow-lg transition-all duration-200 hover:scale-105">
                    <div className="text-3xl mb-3">🏗️</div>
                    <div className="font-bold text-lg">Architect</div>
                    <div className="text-sm text-gray-600 mt-2">System design</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200/50 hover:shadow-lg transition-all duration-200 hover:scale-105">
                    <div className="text-3xl mb-3">🎨</div>
                    <div className="font-bold text-lg">Frontend</div>
                    <div className="text-sm text-gray-600 mt-2">UI/UX development</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200/50 hover:shadow-lg transition-all duration-200 hover:scale-105">
                    <div className="text-3xl mb-3">⚙️</div>
                    <div className="font-bold text-lg">Backend</div>
                    <div className="text-sm text-gray-600 mt-2">API development</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200/50 hover:shadow-lg transition-all duration-200 hover:scale-105">
                    <div className="text-3xl mb-3">📱</div>
                    <div className="font-bold text-lg">Mobile</div>
                    <div className="text-sm text-gray-600 mt-2">Flutter, React Native</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200/50 hover:shadow-lg transition-all duration-200 hover:scale-105">
                    <div className="text-3xl mb-3">🤖</div>
                    <div className="font-bold text-lg">AI/ML</div>
                    <div className="text-sm text-gray-600 mt-2">Machine learning</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200/50 hover:shadow-lg transition-all duration-200 hover:scale-105">
                    <div className="text-3xl mb-3">☁️</div>
                    <div className="font-bold text-lg">DevOps</div>
                    <div className="text-sm text-gray-600 mt-2">Docker, Kubernetes</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 space-y-6">
              <button 
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-full shadow-xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
                onClick={() => setIsLoading(true)}
                disabled={isLoading}
              >
                {isLoading ? 'Starting...' : 'Get Started'}
              </button>
              
              <div className="mt-6">
                <a 
                  href="/analyze-t3"
                  className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-8 rounded-full shadow-xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-400/40"
                >
                  🔍 Analyze T3 Stack Project
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
