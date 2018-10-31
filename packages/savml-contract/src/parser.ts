import yaml from 'yaml'
import {Contract} from './contract'

export default function parser (fileName: string, text: string, strict?: boolean): Contract {
  let data: any
  if (fileName.endsWith('.yaml')) {
    data = yaml.parse(text)
  } else if (fileName.endsWith('.json')) {
    data = JSON.parse(text)
  } else {
    throw new Error(`unkown file type: ${fileName}`)
  }
  const out: any = {};
  Object.assign(out, data)
  if (strict) {
    parserStrict(out)
  }
  return out
}

function parserStrict (contract: any) {
  let tar : Contract = contract
  if (!tar.package) {
    
  }
}
