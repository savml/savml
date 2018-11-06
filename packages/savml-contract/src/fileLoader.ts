import { Loader } from './loader'
import { Contract } from './contract'
import path from 'path'
import fs from 'fs'
import { parse } from './parser'
import yaml from 'yaml'
import { mapExt } from './util'

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
        fs.access(absoultePath, (err) => {
          if (err) {
            return reject(err)
          }
          return resolve(absoultePath)
        })
      } else {
        let paths: Array<string> = this.paths.splice(0)
        paths.unshift('.')
        let guessFormat = !mapExt(path.extname(packageName))
        return paths.reduce((ret, dir) => { // 目录递归
          return ret.then(val => {
            if (val) {
              return val
            }
            let absoultePaths:Array<string> = []
            if (guessFormat) {
              absoultePaths.push(path.join(dir, packageName), '.json')
              absoultePaths.push(path.join(dir, packageName), '.yml')
              absoultePaths.push(path.join(dir, packageName), '.yaml')
            } else {
              absoultePaths.push(path.join(dir, packageName))
            }
            return absoultePaths.reduce((res, file) => { // 文件递归
              return res.then(val2 => {
                if (val2) {
                  return val2
                }
                return new Promise<string>((resolve) => {
                  fs.access(file, (err) => resolve(err ? '' : file))
                })
              })
            }, Promise.resolve(''))
          })
        }, Promise.resolve(''))
      }
    })
  }
  fetch (url: string, _?: object): Promise<Contract> {
    return new Promise((resolve, reject) => {
      let ext = mapExt(path.extname(url))
      if (!ext) {
        return reject(new Error(`unknown file type: ${url}`))
      }
      fs.readFile(url, (err, data: Buffer) => {
        if (err) {
          return reject(err)
        }
        let ret
        try {
          if (ext === 'yml') {
            ret = yaml.parse(data.toString())
          } else {
            ret = parse(data.toString())
          }
        } catch (err) {
          return reject(err)
        }
        resolve(ret)
      })
    })
  }
}
