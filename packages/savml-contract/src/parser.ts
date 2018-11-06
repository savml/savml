
import { Contract } from './contract'

export function parse (text: string): Contract {
  return JSON.parse(text)
}
