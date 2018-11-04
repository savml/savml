import {Contract} from './contract'

export interface Loader {
  fetch(url: string) : Promise<Contract>;
}
