import { Contract, Loader } from '../contract/contract'

export class MemLoader implements Loader {
  private contracts: Array<Contract> = []
  constructor (contracts: Array<Contract>) {
    this.contracts = contracts
  }
  resolve (packageName: string, version?:string) : Promise<string> {
    let find = this.contracts.some((iter: Contract) => {
      if (iter.package === packageName) {
        return !version || (iter.version === version)
      }
      return false
    })
    return find ? Promise.resolve(packageName) : Promise.reject(`no found ${packageName}`)
  }
  fetch (url: string, _?: object): Promise<Contract> {
    let contract = this.contracts.find((iter: Contract) => {
      if (iter.package === url) {
        return true
      }
      return false
    })
    return contract ? Promise.resolve(contract) : Promise.reject(`no found ${url}`)
  }
}
