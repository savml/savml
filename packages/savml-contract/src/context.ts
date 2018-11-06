import { Loader } from "./loader";
import { Contract } from "./contract";

interface LoaderContext {
  loader: Loader,
  options: object | undefined
}

interface ContractContext {
  url: string
  contract: Contract
  deps: Array<ContractContext>
}

export class Context {
  private loaders: Array<LoaderContext>
  private contexts: Array<ContractContext>
  constructor() {
    
  }
  addLoader(loader: Loader, options: object | undefined) {
    this.loaders.push({
      loader,
      options
    })
  }
  // private fetch(url: string) : Promise<Contract> {
    
  // }

}
