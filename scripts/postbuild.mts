import { resolve } from 'node:path'
import { existsSync } from 'node:fs'
import fixDts from '../lib/fix-dts'

const pathToDts = resolve(process.cwd(), 'dist', 'index.d.ts')

if (!existsSync(pathToDts)) {
  console.error('Declaration file not found in "dist".')
  process.exit()
}

fixDts([pathToDts], {
  replace: [['declare module "main"', 'declare module "@arpansaha13/tsc-out"']],
})
