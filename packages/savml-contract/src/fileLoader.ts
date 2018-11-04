import {Loader} from './loader'
import {Contract} from './contract'
import path from 'path'
import fs from 'fs'
import {parse} from './parser'
import yaml from 'yaml'

export class FileLoader implements Loader {
  fetch(url: string): Promise<Contract> {
    return new Promise((resolve, reject) => {
      let ext = mapExt(path.extname(url))
      if (!ext) {
        return reject(new Error(`unknown file type: ${url}`))
      }
      fs.readFile(url, (err, data: Buffer) => {
        if (err) {
          return reject(err)
        }
        if (ext == 'yml') {
          return resolve(yaml.parse(data.toString()))
        }
        resolve(parse(data.toString()))
      })
    })
  }
}

function mapExt(ext: string) : string | undefined {
  switch (ext) {
    case '.json':
      return 'json'
    case '.yml':
    case '.yaml':
      return 'yml'
    default:
      return
  }
}
