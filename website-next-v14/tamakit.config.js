
module.exports = {
  // Specify target platforms
  platforms: ['web', 'native'],
  
  // Component output directory
  outDir: './components/ui',
  
  // Theme customization
  theme: {
    // Your theme overrides here
  },
  
  // Project type
  projectType: 'next',

  // Next.js specific configuration
  next: {
    appDir: true,
    pagesDir: './pages',
  },
}
