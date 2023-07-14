import { builtinModules } from 'module'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: './lib/tsc-out.ts',
      name: 'tsc-out',
      formats: ['es', 'cjs'],
      fileName(format) {
        switch (format) {
          case 'es':
            return 'index.mjs'
          case 'cjs':
            return 'index.cjs'
          default:
            return `index.${format}.js`
        }
      },
    },
    rollupOptions: {
      external: [
        // node built in modules
        ...builtinModules,
        'node:fs/promises',
        'node:child_process',

        // dependencies
        'fast-glob',

        // Only two utils are used from this dependency. So it may be inlined.
        // '@arpansaha13/utils',
      ],
    },
  },
})
