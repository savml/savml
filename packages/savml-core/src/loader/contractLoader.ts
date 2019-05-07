import { Contract, ContractContext, Dependencies, Loader, ContractContextFactory } from '@savml/contract'
import { TContractContext } from './contractContext';

interface LoaderContext {
  loader: Loader,
  options: object | undefined
}

export class ContractLoader implements ContractContextFactory {
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
        let filePath
        try {
          filePath = await iter.loader.resolve(packageName, version)
        } catch(err) {
          console.log(err)
          //@TODO log error
        }
        if (filePath) {
          return iter.loader.fetch(filePath, iter.options)
        }
        return
      })
    }, Promise.resolve())
    if (contract) {
      let deps : Array<ContractContext> = []
      let dependencies = contract.dependencies
      if (dependencies) {
        deps = await Promise.all(
          Object.keys(dependencies).map((name) => this.fetch(
            (<Dependencies>dependencies)[name].package, (<Dependencies>dependencies)[name].version))
        )
      }
      let res : ContractContext = new TContractContext(contract, deps)
      ctxs[contract.version] = res
      return res
    }
    throw new Error(`can not fetch ${packageName} ${version || ''}`)
  }
}
