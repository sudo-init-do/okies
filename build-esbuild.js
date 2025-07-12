// build-esbuild.js
require('esbuild').build({
  entryPoints: ['src/main.ts'],
  bundle:      true,
  platform:    'node',
  target:      'node18',        // or whatever Node version you’re running
  format:      'cjs',           // Nest defaults to CommonJS
  outdir:      'dist',
  sourcemap:   true,
  external: [
    // leave any native or large deps external so they’re loaded at runtime
    '@nestjs/microservices',
    '@nestjs/websockets',
    'cache-manager',
    'class-transformer',
    'class-validator',
    'firebase-admin',
    'reflect-metadata',
    'rxjs'
  ]
}).catch(err => {
  console.error(err)
  process.exit(1)
})
