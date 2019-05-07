import { Method } from "@savml/contract";

export function cli() {
  console.log(Method.GET);
  return Promise.resolve('GET');
}
