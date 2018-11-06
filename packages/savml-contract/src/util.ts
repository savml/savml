
export function mapExt(ext: string) : string | undefined {
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

export function isBoolean(val: any) {
  return typeof val === 'boolean'
}

export function isString(val: any) {
  return typeof val === 'string'
}
