import { Loader } from '../contract/loader'
import { Contract } from '../contract/contract'
import { parse } from './parser'
import fetch from 'node-fetch'

export class UrlLoader implements Loader {
  private registries: Array<Object> = []
  constructor (registries?: Array<Object>) {
    if (Array.isArray(registries)) {
      this.registries = registries
    }
  }
  resolve (packageName: string, version?:string) : Promise<string> {
    let registries = this.registries
    packageName = `${packageName}/${version || 'latest'}`
    return registries.reduce((res:Promise<string>, config: any) => {
      return res.then(val => {
        if (val) {
          return val
        }
        val = `${config.url}/${packageName}`
        return fetch(val, config).then(r => {
          if (r.status === 200) {
            return val
          }
          return ''
        })
      })
    }, Promise.resolve(''))
  }
  fetch (url: string, options?: object): Promise<Contract> {
    return fetch(url, Object.assign({
      method: 'GET'
    }, options)).then(r => {
      return r.text().then(parse)
    })
  }
}
