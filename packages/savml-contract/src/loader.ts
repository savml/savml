import { Contract } from './contract'

export interface Loader {
  resolve(packageName: string, version?:string) : Promise<string>;
  fetch(url: string, options?: object) : Promise<Contract>;
}
