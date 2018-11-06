import {Loader} from './loader'
import {Contract} from './contract'
import {parse} from './parser'
import yaml from 'yaml'
import fetch from 'node-fetch'

export class UrlLoader implements Loader {
  private registries: Array<Object> = []
  constructor (registries?: Array<Object>) {
    if (Array.isArray(registries)) {
      this.registries = registries
    }
  }
  resolve(packageName: string, version?:string) : Promise<string> {
    let registries = this.registries
    if (version) {
      packageName = `${packageName}/${version}`
    }
    return registries.reduce((res:Promise<string>, config) => {
      return res.then(val => {
        if (val) {
          return val
        }
        return fetch(config.url, config).then(r => {
          
        })
      })
    }, Promise.resolve(""))
  }
  fetch(url: string, options?: object): Promise<Contract> {
    return fetch(url, Object.assign({
      method: 'GET'
    }, options)).then(r => {
      return r.text().then(body => {
        if (body[0] === '{') {
          return parse(body)
        }
        return yaml.parse(body)
      })
    })
  }
}
