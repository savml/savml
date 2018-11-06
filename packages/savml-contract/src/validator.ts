import {Contract} from './contract'
import {isString, isBoolean} from './util'

export function isEnumKeyValue(val: any) {
  let tval = typeof val
  return (tval === 'number' && !Number.isNaN(val)) || isString(val) || (tval === 'boolean')
}

export function ensure(obj: any, key: string, checker: any, ns :any = "") {
  if (!checker(obj[key])) {
    throw new Error(`invalid value of ${ns}${key}`)
  }
}

export function ensures(obj: any, keys:Array<string>, checker: any, ns: any = "") {
  keys.forEach(key => ensure(obj, key, checker, ns))
}

export function ensureIf(obj: any, key: string, checker: any, ns :any = "") {
  if (key in obj) {
    if (!checker(obj[key])) {
      throw new Error(`invalid value of ${ns}${key}`)
    }
  }
}

export function validator (tar: Contract | any) {
  ensures(tar, [
    "contract",
    "package",
    "version",
    "title",
    "defaultLang",
  ], isString)
  ensureIf(tar, "description", isString)
  ensureIf(tar, "lang", isString)
  checkDeps(tar)
  checkEnums(tar)
  checkStructs(tar)
  ensureIf(tar, "validaters", Array.isArray)
}

function checkDeps (tar: Contract) {
  ensureIf(tar, "dependencies", Array.isArray)
  if (tar.dependencies) {
    tar.dependencies.forEach((it, id) => {
      ensures(it, ["package", "version"], isString, `dependencies[${id}].`)
      ensureIf(it, "name", isString, `dependencies[${id}].`)
    })
  }
}

function checkEnums(tar: Contract) {
  ensureIf(tar, "enums", Array.isArray)
  if (!tar.enums) {
    return
  }
  tar.enums.forEach((it, id) => {
    ensure(it, "name", isString, `enums[${id}].`)
    ensure(it, "title", isString, `enums.${it.name}.`)
    ensureIf(it, "description", isString, `enums.${it.name}.`)
    ensureIf(it, "fields", Array.isArray, `enums.${it.name}.`)
    if (!it.fields) {
      return
    }
    it.fields.forEach((item, index) => {
      let ns = `enums.${it.name}.fields[${index}].`
      ensures(item, ["key", "value"], isEnumKeyValue, ns)
      ensure(item, "title", isString, ns)
      ensureIf(item, "description", isString, ns)
    })
  })
}

function checkStructs(tar: Contract) {
  ensureIf(tar, "structs", Array.isArray)
  if (!tar.structs) {
    return
  }
  tar.structs.forEach((it, id) => {
    let ns = `structs.${it.name}.`
    ensure(it, "name", isString, `structs[${id}].`)
    ensure(it, "title", isString, ns)
    ensureIf(it, "description", isString, ns)
    ensureIf(it, "fields", Array.isArray, ns)
    if (!it.fields) {
      return
    }
    it.fields.forEach((item, index) => {
      let ns = `structs.${it.name}.fields[${index}].`
      if (item.name) {
        ensure(item, "name", isString, ns)
        {
          let ns = `structs.${it.name}.fields.[${item.name}].`
          ensures(item, ["type", "title"], isString, ns)
        }
      } else {
        ensure(item, "field", isString, ns)
      }
      ensureIf(item, "description", isString, ns)
      ensureIf(item, "optional", isBoolean, ns)
    })
  })
}
