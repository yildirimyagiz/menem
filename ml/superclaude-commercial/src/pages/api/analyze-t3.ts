import fs from 'fs'
import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'

type AnalysisResult = {
  analysis: string
  recommendations: string[]
  metrics: Record<string, any>
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AnalysisResult | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { projectPath, analysisType } = req.body
    
    // Analyze the T3 stack project
    const analysis = await analyzeT3Stack(projectPath, analysisType)
    
    res.status(200).json(analysis)
  } catch (error) {
    console.error('Analysis error:', error)
    res.status(500).json({ error: 'Failed to analyze project' })
  }
}

async function analyzeT3Stack(projectPath: string, analysisType: string): Promise<AnalysisResult> {
  const fullPath = path.resolve(process.cwd(), projectPath)
  
  // Read key files for analysis
  const packageJson = JSON.parse(fs.readFileSync(path.join(fullPath, 'package.json'), 'utf8'))
  const nextConfig = fs.readFileSync(path.join(fullPath, 'next.config.js'), 'utf8')
  const tsConfig = JSON.parse(fs.readFileSync(path.join(fullPath, 'tsconfig.json'), 'utf8'))
  
  // Analyze project structure
  const srcPath = path.join(fullPath, 'src')
  const appPath = path.join(srcPath, 'app')
  const componentsPath = path.join(srcPath, 'components')
  
  const structure = {
    hasAppRouter: fs.existsSync(appPath),
    hasComponents: fs.existsSync(componentsPath),
    dependencies: Object.keys(packageJson.dependencies || {}),
    devDependencies: Object.keys(packageJson.devDependencies || {}),
    scripts: Object.keys(packageJson.scripts || {})
  }

  // Generate analysis based on type
  let analysis = ''
  let recommendations: string[] = []
  let metrics: Record<string, any> = {}

  switch (analysisType) {
    case 'comprehensive':
      analysis = generateComprehensiveAnalysis(structure, packageJson, nextConfig)
      recommendations = generateRecommendations(structure, packageJson)
      metrics = calculateMetrics(structure, packageJson)
      break
    case 'architecture':
      analysis = generateArchitectureAnalysis(structure, packageJson)
      break
    case 'performance':
      analysis = generatePerformanceAnalysis(structure, packageJson)
      break
    case 'security':
      analysis = generateSecurityAnalysis(structure, packageJson)
      break
    default:
      analysis = generateComprehensiveAnalysis(structure, packageJson, nextConfig)
  }

  return {
    analysis,
    recommendations,
    metrics
  }
}

function generateComprehensiveAnalysis(structure: any, packageJson: any, nextConfig: string): string {
  return `
🔍 T3 Stack Comprehensive Analysis
=====================================

📦 Project Structure Analysis:
${structure.hasAppRouter ? '✅' : '❌'} App Router (Next.js 13+)
${structure.hasComponents ? '✅' : '❌'} Components directory
${structure.dependencies.includes('@trpc/client') ? '✅' : '❌'} tRPC integration
${structure.dependencies.includes('@prisma/client') ? '✅' : '❌'} Prisma ORM
${structure.dependencies.includes('next-auth') ? '✅' : '❌'} Authentication
${structure.dependencies.includes('tailwindcss') ? '✅' : '❌'} Tailwind CSS

🚀 Key Technologies:
- Next.js: ${packageJson.dependencies?.next || 'Not found'}
- TypeScript: ${packageJson.devDependencies?.typescript || 'Not found'}
- tRPC: ${structure.dependencies.includes('@trpc/client') ? 'Configured' : 'Missing'}
- Prisma: ${structure.dependencies.includes('@prisma/client') ? 'Configured' : 'Missing'}
- Capacitor: ${structure.dependencies.includes('@capacitor/core') ? 'Mobile ready' : 'Web only'}

📱 Mobile Features:
${structure.dependencies.includes('@capacitor/core') ? '✅ Capacitor for mobile apps' : '❌ No mobile support'}
${structure.dependencies.includes('@capacitor/android') ? '✅ Android support' : '❌ No Android'}
${structure.dependencies.includes('@capacitor/ios') ? '✅ iOS support' : '❌ No iOS'}

🌐 Internationalization:
${structure.dependencies.includes('next-intl') ? '✅ i18n configured' : '❌ No i18n'}

💳 Payment Integration:
${structure.dependencies.includes('@stripe/stripe-js') ? '✅ Stripe payments' : '❌ No payment system'}

🗺️ Maps Integration:
${structure.dependencies.includes('@googlemaps/google-maps-services-js') ? '✅ Google Maps' : '❌ No maps'}

📊 Performance Features:
${structure.dependencies.includes('framer-motion') ? '✅ Animations' : '❌ No animations'}
${structure.dependencies.includes('@tanstack/react-query') ? '✅ React Query' : '❌ No query caching'}

🔧 Development Tools:
${structure.devDependencies.includes('eslint') ? '✅ ESLint' : '❌ No linting'}
${structure.devDependencies.includes('prettier') ? '✅ Prettier' : '❌ No formatting'}
${structure.devDependencies.includes('typescript') ? '✅ TypeScript' : '❌ No type checking'}

📈 Project Health Score: ${calculateHealthScore(structure, packageJson)}/100

🎯 Recommendations:
1. ${structure.hasAppRouter ? 'App Router is properly configured' : 'Consider migrating to App Router'}
2. ${structure.dependencies.includes('@trpc/client') ? 'tRPC is well integrated' : 'Add tRPC for type-safe APIs'}
3. ${structure.dependencies.includes('@prisma/client') ? 'Database layer is solid' : 'Consider adding Prisma for database management'}
4. ${structure.dependencies.includes('next-auth') ? 'Authentication is configured' : 'Add NextAuth.js for authentication'}
5. ${structure.dependencies.includes('@capacitor/core') ? 'Mobile support is ready' : 'Consider adding Capacitor for mobile apps'}

🚀 Next Steps:
- Review component architecture
- Optimize bundle size
- Add comprehensive testing
- Implement CI/CD pipeline
- Consider adding monitoring and analytics
`
}

function generateArchitectureAnalysis(structure: any, packageJson: any): string {
  return `
🏗️ Architecture Analysis
========================

📁 Directory Structure:
${structure.hasAppRouter ? '✅ Using App Router (modern Next.js)' : '❌ Using Pages Router (legacy)'}
${structure.hasComponents ? '✅ Components directory exists' : '❌ No components directory'}

🔧 Technology Stack:
- Framework: Next.js ${packageJson.dependencies?.next || 'Unknown version'}
- Language: TypeScript ${packageJson.devDependencies?.typescript ? 'Configured' : 'Not configured'}
- Styling: ${structure.dependencies.includes('tailwindcss') ? 'Tailwind CSS' : 'Unknown'}
- State Management: ${structure.dependencies.includes('zustand') ? 'Zustand' : 'Unknown'}

📦 Package Analysis:
- Total dependencies: ${Object.keys(packageJson.dependencies || {}).length}
- Dev dependencies: ${Object.keys(packageJson.devDependencies || {}).length}
- Bundle size impact: ${calculateBundleImpact(packageJson)}

🎯 Architecture Recommendations:
1. ${structure.hasAppRouter ? 'App Router provides better performance' : 'Migrate to App Router for better performance'}
2. ${structure.dependencies.includes('@trpc/client') ? 'tRPC ensures type safety' : 'Add tRPC for type-safe APIs'}
3. ${structure.dependencies.includes('@prisma/client') ? 'Prisma provides excellent DX' : 'Consider Prisma for database management'}
`
}

function generatePerformanceAnalysis(structure: any, packageJson: any): string {
  return `
⚡ Performance Analysis
=======================

📊 Bundle Analysis:
- Core dependencies: ${Object.keys(packageJson.dependencies || {}).length}
- Development dependencies: ${Object.keys(packageJson.devDependencies || {}).length}
- Estimated bundle size: ${estimateBundleSize(packageJson)}KB

🚀 Performance Features:
${structure.dependencies.includes('@tanstack/react-query') ? '✅ React Query for caching' : '❌ No query caching'}
${structure.dependencies.includes('framer-motion') ? '✅ Optimized animations' : '❌ No animation library'}
${structure.dependencies.includes('next') ? '✅ Next.js optimizations' : '❌ Not using Next.js'}

📱 Mobile Performance:
${structure.dependencies.includes('@capacitor/core') ? '✅ Mobile-optimized' : '❌ Web-only'}
${structure.dependencies.includes('@capacitor/android') ? '✅ Android optimizations' : '❌ No Android'}
${structure.dependencies.includes('@capacitor/ios') ? '✅ iOS optimizations' : '❌ No iOS'}

🎯 Performance Recommendations:
1. Implement code splitting
2. Add image optimization
3. Use React Query for data caching
4. Optimize bundle size
5. Add performance monitoring
`
}

function generateSecurityAnalysis(structure: any, packageJson: any): string {
  return `
🔒 Security Analysis
====================

🛡️ Security Features:
${structure.dependencies.includes('next-auth') ? '✅ Authentication system' : '❌ No authentication'}
${structure.dependencies.includes('@stripe/stripe-js') ? '✅ Secure payments' : '❌ No payment security'}
${structure.dependencies.includes('zod') ? '✅ Input validation' : '❌ No validation library'}

🔐 Security Recommendations:
1. Implement proper authentication
2. Add input validation with Zod
3. Use HTTPS in production
4. Implement rate limiting
5. Add security headers
6. Regular dependency updates
`
}

function generateRecommendations(structure: any, packageJson: any): string[] {
  const recommendations = []
  
  if (!structure.hasAppRouter) {
    recommendations.push('Migrate to App Router for better performance and features')
  }
  
  if (!structure.dependencies.includes('@trpc/client')) {
    recommendations.push('Add tRPC for type-safe API communication')
  }
  
  if (!structure.dependencies.includes('@prisma/client')) {
    recommendations.push('Consider adding Prisma for database management')
  }
  
  if (!structure.dependencies.includes('next-auth')) {
    recommendations.push('Add NextAuth.js for authentication')
  }
  
  if (!structure.dependencies.includes('@capacitor/core')) {
    recommendations.push('Consider adding Capacitor for mobile app support')
  }
  
  return recommendations
}

function calculateMetrics(structure: any, packageJson: any): Record<string, any> {
  return {
    healthScore: calculateHealthScore(structure, packageJson),
    bundleSize: estimateBundleSize(packageJson),
    dependencies: Object.keys(packageJson.dependencies || {}).length,
    devDependencies: Object.keys(packageJson.devDependencies || {}).length,
    hasMobileSupport: structure.dependencies.includes('@capacitor/core'),
    hasAuthentication: structure.dependencies.includes('next-auth'),
    hasDatabase: structure.dependencies.includes('@prisma/client'),
    hasTypeSafety: structure.dependencies.includes('@trpc/client')
  }
}

function calculateHealthScore(structure: any, packageJson: any): number {
  let score = 0
  
  if (structure.hasAppRouter) score += 20
  if (structure.dependencies.includes('@trpc/client')) score += 15
  if (structure.dependencies.includes('@prisma/client')) score += 15
  if (structure.dependencies.includes('next-auth')) score += 10
  if (structure.dependencies.includes('tailwindcss')) score += 10
  if (structure.dependencies.includes('@capacitor/core')) score += 10
  if (structure.dependencies.includes('typescript')) score += 10
  if (structure.dependencies.includes('@tanstack/react-query')) score += 10
  
  return Math.min(score, 100)
}

function calculateBundleImpact(packageJson: any): string {
  const heavyDeps = ['framer-motion', '@googlemaps/google-maps-services-js', 'leaflet']
  const found = heavyDeps.filter(dep => packageJson.dependencies?.[dep])
  
  if (found.length === 0) return 'Low'
  if (found.length <= 2) return 'Medium'
  return 'High'
}

function estimateBundleSize(packageJson: any): number {
  const deps = Object.keys(packageJson.dependencies || {})
  let size = 100 // Base size
  
  if (deps.includes('framer-motion')) size += 50
  if (deps.includes('@googlemaps/google-maps-services-js')) size += 30
  if (deps.includes('leaflet')) size += 25
  if (deps.includes('@stripe/stripe-js')) size += 20
  
  return size
} 