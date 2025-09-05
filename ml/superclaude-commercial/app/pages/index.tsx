import Head from 'next/head'
import { useState } from 'react'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <>
      <Head>
        <title>SuperClaude - AI Coding Assistant</title>
        <meta name="description" content="Professional AI coding assistant with local processing" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🚀 SuperClaude
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              The Ultimate AI Coding Assistant
            </p>
            
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-semibold mb-4">Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Local AI Processing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Multiple Models</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Context-Aware</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Multi-Language Support</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Specialized Personas</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                  <div className="text-center p-3 bg-blue-50 rounded">
                    <div className="text-2xl mb-2">🏗️</div>
                    <div className="font-semibold">Architect</div>
                    <div className="text-sm text-gray-600">System design</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded">
                    <div className="text-2xl mb-2">🎨</div>
                    <div className="font-semibold">Frontend</div>
                    <div className="text-sm text-gray-600">UI/UX development</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded">
                    <div className="text-2xl mb-2">⚙️</div>
                    <div className="font-semibold">Backend</div>
                    <div className="text-sm text-gray-600">API development</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded">
                    <div className="text-2xl mb-2">📱</div>
                    <div className="font-semibold">Mobile</div>
                    <div className="text-sm text-gray-600">Flutter, React Native</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded">
                    <div className="text-2xl mb-2">🤖</div>
                    <div className="font-semibold">AI/ML</div>
                    <div className="text-sm text-gray-600">Machine learning</div>
                  </div>
                  <div className="text-center p-3 bg-indigo-50 rounded">
                    <div className="text-2xl mb-2">☁️</div>
                    <div className="font-semibold">DevOps</div>
                    <div className="text-sm text-gray-600">Docker, Kubernetes</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                onClick={() => setIsLoading(true)}
                disabled={isLoading}
              >
                {isLoading ? 'Starting...' : 'Get Started'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  )
} 