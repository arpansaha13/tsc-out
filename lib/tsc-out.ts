import { spawn } from 'node:child_process'
import { rm } from 'node:fs/promises'

import ts from 'typescript'
import fg, { type Pattern as FgPattern, type Options as FgOptions } from 'fast-glob'
import { isNullOrUndefined } from '@arpansaha13/utils'
import { writeJsonFile } from '@arpansaha13/utils/node'

import fixDts, { type FixDtsOptions } from './fix-dts'

export interface TscOutOptions {
  include: FgPattern | FgPattern[]
  exclude?: FgPattern | FgPattern[]
  fgOptions?: FgOptions
  fixDtsOptions?: FixDtsOptions
}

/**
 * A utility for generating a single declaration outFile from a bunch of typescript files.
 */
export default async function tscOut(outFile: string, options: TscOutOptions) {
  const includeGlob = options.include
  const excludeGlob = options.exclude
  const fgOptions = options.fgOptions ?? {}

  // TODO: Try converting them to absolute
  const includePaths = await fg(includeGlob, fgOptions)
  const excludePaths = excludeGlob ? await fg(excludeGlob, fgOptions) : []

  await doBuild(outFile, includePaths, excludePaths)

  if (!isNullOrUndefined(options.fixDtsOptions)) {
    const files = await fg(outFile, {
      onlyFiles: true,
    })

    await fixDts(files, options.fixDtsOptions)
  }
}

const GENERATED_TSCONFIG_FILENAME = 'tsconfig.fix-dts.json'

async function doBuild(outFile: string, includePaths: ReadonlyArray<string>, excludePaths: ReadonlyArray<string>) {
  const tsConfig = getTsConfig(outFile, includePaths, excludePaths)

  await writeJsonFile(GENERATED_TSCONFIG_FILENAME, tsConfig)

  const buildTypesProcess = spawn(`tsc -p ${GENERATED_TSCONFIG_FILENAME}`, {
    shell: true,
    stdio: 'inherit',
  })

  await new Promise(res => buildTypesProcess.on('exit', res))

  await rm(GENERATED_TSCONFIG_FILENAME)
}

function getTsConfig(outFile: string, include: ReadonlyArray<string>, exclude: ReadonlyArray<string>) {
  const compilerOptions: ts.CompilerOptions = {
    strict: true,
    allowJs: false,
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.ESNext,
    noUnusedLocals: true,
    strictNullChecks: true,
    outFile,
    sourceMap: false,
    declaration: true,
    declarationMap: false,
    emitDeclarationOnly: true,
    resolveJsonModule: true,
    allowSyntheticDefaultImports: true,
    forceConsistentCasingInFileNames: true,
    baseUrl: '.',
    skipLibCheck: true,
    esModuleInterop: true,
    noImplicitAny: true,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    types: ['@types/node'],
  }

  const tsConfig = {
    compilerOptions,
    include,
    exclude,
  }

  return tsConfig
}
