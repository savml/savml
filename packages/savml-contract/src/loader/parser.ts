import { Contract } from '../contract/contract'
import yaml from 'yaml'

// @TODO 验证器
export function parse (text: string, format?: string): Contract {
  format || (format = text[0] === '{' ? 'json' : 'yml')
  let contract
  switch (format) {
    case 'json':
      contract = JSON.parse(text)
      break
    case 'yml':
      contract = yaml.parse(text)
      break
    default:
      throw Error("can not parse contract")
  }
  return contract
}
