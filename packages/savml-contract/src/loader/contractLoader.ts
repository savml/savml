import { Loader } from '../contract/loader'
import { Contract, ContractContext } from '../contract/contract'

interface LoaderContext {
  loader: Loader,
  options: object | undefined
}

export class ContractLoader {
  private loaders: Array<LoaderContext> = []
  private contexts: { [key: string]: {[key: string]:ContractContext}; } = {}
  constructor () {

  }
  addLoader (loader: Loader, options?: object) {
    this.loaders.push({
      loader,
      options
    })
  }
  async fetch (packageName: string, version?: string) : Promise<ContractContext> {
    let ctxs = this.contexts[packageName]
    if (!ctxs) {
      ctxs = this.contexts[packageName] = {}
    } else {
      if (version && ctxs[version]) {
        return ctxs[version]
      }
    }
    let contract = await this.loaders.reduce((res: Promise<Contract|void>, iter) => {
      return res.then(async (val) => {
        if (val) {
          return val
        }
        let path = await iter.loader.resolve(packageName, version)
        if (path) {
          return iter.loader.fetch(path, iter.options)
        }
        return
      })
    }, Promise.resolve())
    if (contract) {
      let res : ContractContext = {
        contract,
        deps: []
      }
      ctxs[contract.version] = res
      if (contract.dependencies) {
        res.deps = await Promise.all(contract.dependencies.map(it => this.fetch(it.package, it.version)))
      }
      return res
    }
    throw new Error(`can not fetch ${packageName} ${version || ''}`)
  }
}
