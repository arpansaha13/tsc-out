import { builtinModules } from 'module'
import { build } from 'vite'

build({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: 'lib/main.ts',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [
        ...builtinModules,
        'node:fs',
        'node:path',
        'node:fs/promises',
        'node:child_process',
      ],
    },
    sourcemap: false,
  },
})