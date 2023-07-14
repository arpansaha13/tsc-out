import { readFile, writeFile } from 'node:fs/promises'
import { isNullOrUndefined } from '@arpansaha13/utils'

// At least one fix option must be specified
// Otherwise this function has no point

export interface FixDtsOptions {
  replace?: [string, string][]
}

/**
 * A utility for modifying generated type declaration files.
 */
export default async function fixDts(files: string[], options: FixDtsOptions) {
  for (const f of files) {
    const raw = await readFile(f, 'utf-8')

    let changed = doReplace(raw, options.replace)

    await writeFile(f, changed, 'utf-8')
  }
}

function doReplace(raw: string, replaceOption: FixDtsOptions['replace']) {
  if (isNullOrUndefined(replaceOption)) return raw

  let replaced = raw

  for (const r of replaceOption) {
    replaced = replaced.replace(r[0], r[1])
  }

  return replaced
}
