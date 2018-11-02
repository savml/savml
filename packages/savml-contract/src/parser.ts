
import {Contract} from './contract'

export function parser (text: string): Contract {
  return JSON.parse(text)
}
