import { ContractContext } from './contract'

export type Writer = (ctx: ContractContext, opts: object) => Promise<any>
