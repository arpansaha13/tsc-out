// The file names are kept such that the module names in the generated declaration file are appropriate

import tscOut, { type TscOutOptions } from './tsc-out.main'

export { default as fixDts, type FixDtsOptions } from './fix-dts'
export type { TscOutOptions }

export default tscOut
