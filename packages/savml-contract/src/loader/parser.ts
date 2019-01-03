
import { Contract } from '../contract/contract'

export function parse (text: string): Contract {
  return JSON.parse(text)
}
