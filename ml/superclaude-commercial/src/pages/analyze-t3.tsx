import Head from 'next/head'
import { useState } from 'react'

export default function AnalyzeT3() {
  const [analysis, setAnalysis] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const analyzeT3Stack = async () => {
    setIsAnalyzing(true)
    try {
      // This would integrate with the SuperClaude AI service
      const response = await fetch('/api/analyze-t3', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectPath: '../../apps/client',
          analysisType: 'comprehensive'
        })
      })
      
      const data = await response.json()
      setAnalysis(data.analysis)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setAnalysis('Error analyzing project: ' + errorMessage)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <>
      <Head>
        <title>SuperClaude - T3 Stack Analysis</title>
        <meta name="description" content="Analyze T3 stack projects with AI" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {process.env.NODE_ENV !== 'development' && (
          <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' http://localhost:* https://localhost:*;" />
        )}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400">
        {/* Animated Glassmorphism overlay */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-white/60 backdrop-blur-lg transition-all duration-700" />
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 drop-shadow-xl md:text-6xl mb-4">
              🔍 T3 Stack Analysis
            </h1>
            <p className="text-xl text-gray-700 md:text-2xl mb-8">
              Analyze and enhance your T3 stack projects with SuperClaude AI
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl ring-1 ring-blue-200 p-8 mb-8 transition-all duration-200 hover:scale-[1.02]">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">Project Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <div className="p-6 bg-blue-50/50 rounded-xl border border-blue-200/50">
                  <h3 className="font-bold text-gray-800 mb-4 text-lg">Current T3 Stack:</h3>
                  <ul className="space-y-3 text-sm text-gray-700">
                    <li className="flex items-center space-x-2">
                      <span className="text-green-500 text-lg">✓</span>
                      <span>Next.js 14 with App Router</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-green-500 text-lg">✓</span>
                      <span>TypeScript for type safety</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-green-500 text-lg">✓</span>
                      <span>tRPC for type-safe APIs</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-green-500 text-lg">✓</span>
                      <span>Prisma for database ORM</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-green-500 text-lg">✓</span>
                      <span>NextAuth.js for authentication</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-green-500 text-lg">✓</span>
                      <span>Tailwind CSS for styling</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-green-500 text-lg">✓</span>
                      <span>Capacitor for mobile apps</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-green-500 text-lg">✓</span>
                      <span>Internationalization (i18n)</span>
                    </li>
                  </ul>
                </div>
                <div className="p-6 bg-green-50/50 rounded-xl border border-green-200/50">
                  <h3 className="font-bold text-gray-800 mb-4 text-lg">Key Features:</h3>
                  <ul className="space-y-3 text-sm text-gray-700">
                    <li className="flex items-center space-x-2">
                      <span className="text-blue-500 text-lg">🚀</span>
                      <span>Real-time property listings</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-blue-500 text-lg">🗺️</span>
                      <span>Google Maps integration</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-blue-500 text-lg">💳</span>
                      <span>Payment processing (Stripe)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-blue-500 text-lg">📱</span>
                      <span>Mobile app support</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-blue-500 text-lg">🌐</span>
                      <span>Multi-language support</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-blue-500 text-lg">🔍</span>
                      <span>Advanced search & filters</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl ring-1 ring-blue-200 p-8 mb-8 transition-all duration-200 hover:scale-[1.02]">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">AI Analysis Options</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200/50 hover:shadow-lg transition-all duration-200 hover:scale-105">
                  <div className="text-3xl mb-3">🏗️</div>
                  <div className="font-bold text-lg">Architecture Review</div>
                  <div className="text-sm text-gray-600 mt-2">Analyze code structure and patterns</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200/50 hover:shadow-lg transition-all duration-200 hover:scale-105">
                  <div className="text-3xl mb-3">⚡</div>
                  <div className="font-bold text-lg">Performance Audit</div>
                  <div className="text-sm text-gray-600 mt-2">Identify optimization opportunities</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200/50 hover:shadow-lg transition-all duration-200 hover:scale-105">
                  <div className="text-3xl mb-3">🔒</div>
                  <div className="font-bold text-lg">Security Analysis</div>
                  <div className="text-sm text-gray-600 mt-2">Review security best practices</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200/50 hover:shadow-lg transition-all duration-200 hover:scale-105">
                  <div className="text-3xl mb-3">📱</div>
                  <div className="font-bold text-lg">Mobile Optimization</div>
                  <div className="text-sm text-gray-600 mt-2">Enhance mobile experience</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200/50 hover:shadow-lg transition-all duration-200 hover:scale-105">
                  <div className="text-3xl mb-3">🤖</div>
                  <div className="font-bold text-lg">AI Integration</div>
                  <div className="text-sm text-gray-600 mt-2">Add AI-powered features</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200/50 hover:shadow-lg transition-all duration-200 hover:scale-105">
                  <div className="text-3xl mb-3">☁️</div>
                  <div className="font-bold text-lg">DevOps Review</div>
                  <div className="text-sm text-gray-600 mt-2">Deployment & infrastructure</div>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl ring-1 ring-blue-200 p-8 transition-all duration-200 hover:scale-[1.02]">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">Start Analysis</h2>
              <button 
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-full shadow-xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400/40 disabled:opacity-50"
                onClick={analyzeT3Stack}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze T3 Stack Project'}
              </button>
              
              {analysis && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4">Analysis Results:</h3>
                  <div className="bg-gray-50/90 backdrop-blur-sm p-6 rounded-xl border border-gray-200/50 text-sm font-mono whitespace-pre-wrap shadow-lg">
                    {analysis}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
} 