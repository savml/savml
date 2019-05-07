import { Contract, Loader } from '@savml/contract'
import {join, extname} from 'path'
import {access, readFile} from 'fs'
import { parse } from './parser'

const mapExt = (ext: string) : string => {
  ext = ext.substr(1, ext.length)
  return ['yml', 'json'].indexOf(ext) !== -1 ? ext : ''
}

export class FileLoader implements Loader {
  private paths: Array<string> = []
  constructor (paths?: Array<string>) {
    if (Array.isArray(paths)) {
      this.paths = paths
    }
  }
  resolve (packageName: string, _?:string) : Promise<string> {
    return new Promise((resolve, reject) => {
      if (packageName.startsWith('http:') || packageName.startsWith('https:')) {
        return reject(new Error(`FileLoader can not load ${packageName}`))
      }
      let absoultePath: string = ''
      if (packageName.startsWith('file://')) {
        absoultePath = packageName
      }
      if (packageName.startsWith('/')) {
        absoultePath = packageName
      }
      if (absoultePath) {
        access(absoultePath, (err: any) => {
          if (err) {
            return reject(err)
          }
          return resolve(absoultePath)
        })
      } else {
        let paths: Array<string> = this.paths.slice(0)
        paths.unshift('.')
        let guessFormat = !mapExt(extname(packageName))
        return paths.reduce((ret, dir) => { // 目录递归
          return ret.then(val => {
            if (val) {
              return val
            }
            let absoultePaths:Array<string> = []
            if (guessFormat) {
              absoultePaths.push(join(dir, packageName + '.json'))
              absoultePaths.push(join(dir, packageName + '.yml'))
            } else {
              absoultePaths.push(join(dir, packageName))
            }
            return absoultePaths.reduce((res, file) => { // 文件递归
              return res.then(val2 => {
                if (val2) {
                  return val2
                }
                return new Promise<string>((resolve) => {
                  access(file, (err: any) => resolve(err ? '' : file))
                })
              })
            }, Promise.resolve(''))
          })
        }, Promise.resolve('')).then(resolve)
      }
    })
  }
  fetch (url: string, _?: object): Promise<Contract> {
    return new Promise((resolve, reject) => {
      let ext = mapExt(extname(url))
      if (!ext) {
        return reject(new Error(`unknown file type: ${url}`))
      }
      readFile(url, (err: any, data: Buffer) => {
        if (err) {
          return reject(err)
        }
        let ret
        try {
          ret = parse(data.toString(), ext)
        } catch (err) {
          return reject(err)
        }
        resolve(ret)
      })
    })
  }
}
