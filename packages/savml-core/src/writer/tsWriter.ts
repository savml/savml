import {Context, Service, Services, Actions, Action, Structs, Dependencies} from '@savml/contract'

export class TsWriter {
  createInterface(ctx: Context) : string {
    const {dependencies, services, structs} = ctx.contract
    const opts = {
      indent: 0
    }
    let lists = ['']
    if (dependencies) {
      let arr = this.createDeps(dependencies, opts.indent)
      lists.push('// imports', ...arr, '')
    }
    let structsKeys : string[] = []
    if (structs) {
      let arr = this.createStructs(structs, opts.indent)
      lists.push('// structs', ...arr)
      structsKeys.push(...Object.keys(structs))
    }
    if (services) {
      let actionStructs = <Structs>{}
      let arr = this.createServices(services, opts.indent, actionStructs)
      let actionStructArr = this.createStructs(actionStructs, opts.indent)
      lists.push('// buildin structs', ...actionStructArr)
      lists.push('// services', ...arr)
      structsKeys.push(...Object.keys(actionStructs))
    }
    //lists.push(...this.createStructsFactory(structsKeys, opts.indent))
    return lists.join('\n')
  }
  createStructsFactory(keys: string[], indent: number) {
    let names : string[] = [`export interface StructsMaker {`]
    names.push(...keys.map(it => {
      return `  ${it}(input ?: ${it}|any): ${it};`
    }))
    names.push(`}`, '')
    return indentArr(indent, names)
  }
  createServices(services: Services, indent : number, structs: Structs) : string[] {
    let res : string[] = []
    let names : string[] = [`export interface ServicesHandler {`]
    for(let serviceName in services) {
      let service : Service = services[serviceName]
      if (service.name){
        serviceName = service.name
      }
      //@TODO add comments
      let arr = [
        '/**',
        ` * ${serviceName}`,
        service.description ? ` * ${service.description}` : '',
        ' */',
        `export interface ${serviceName} {`
      ].filter(it => !!it)
      if (service.actions) {
        arr.push(...this.createActions(service.actions, 1, serviceName, structs))
      }
      arr.push('}')
      res.push(...arr, '')
      names.push(`  ${serviceName}: ${serviceName}`)
    }
    names.push('}', '')
    return indentArr(indent, res.concat(names))
  }
  createActions(actions: Actions, indent: number, serviceName: string, structs: Structs) : string[]{ 
    let res : string[] = []
    for (let actionName in actions) {
      let action : Action = actions[actionName]
      if (action.name){
        actionName = action.name
      }
      let {request, response} = action
      let requestName : string = ''
      if (typeof request === 'string') {
        requestName = request
      } else if (typeof request === 'object' && request != null) {
        structs[requestName = `${serviceName}${actionName}Request`] = request
      }
      let responseName : string = ''
      if (typeof response === 'string') {
        responseName = response
      } else if (typeof response === 'object' && response != null) {
        structs[responseName = `${serviceName}${actionName}Response`] = response
      }
      let input = requestName ? `input: ${requestName}` : ''
      let outputType = responseName
      let text = `${actionName}(${input}): Promise<${outputType || 'void'}>;`
      //@TODO add comments
      let comments = [
        '/**',
        ` * ${actionName}`,
        action.description ? ` * ${action.description}` : '',
        requestName ?     ` * @param input ${requestName}` : '',
        responseName?     ` * @return ${responseName}` : '',
        ' */',
      ]
      comments = comments.filter(it => !!it)
      res.push(...comments)
      res.push(text)
    }
    return indentArr(indent, res)
  }
  createStructs(structs: Structs, indent : number) : string[] {
    let res: string[] = []
    for (let structName in structs) {
      let struct = structs[structName]
      let arr : string[] = [
        '/**',
        ` * ${structName}`,
        struct.description ? ` * ${struct.description}` : '',
        ' */',
      ]
      if (struct.enums) {
        arr.push(`export enum ${structName} {`)
        let enums : string[] = struct.enums.reduce((arr : string[], it) => {
          let ret = [
            '/**',
            ` * ${structName}.${it.key} ${it.title || ''}`,
            it.description ? ` * ${it.description}` : '',
            ' */',
            `${it.key} = ${toEnumValue(it.value)},`,
          ]
          arr.push(...indentArr(1, ret.filter(it => !!it)))
          return arr
        }, [])
        arr.push(...enums)
      } else if (struct.fields) {
        arr.push(`export interface ${structName} {`)
        let fields : string[] = struct.fields.reduce((arr : string[], it) => {
          let ret = [
            '/**',
            ` * ${it.name} ${it.title || ''}`,
            it.description ? ` * ${it.description}` : '',
            ' */',
            `${it.name} ${it.optional ? '?': ''}: ${toFieldType(it.type || 'string')};`,
          ]
          arr.push(...indentArr(1, ret.filter(it => !!it)))
          return arr
        }, [])
        arr.push(...fields)
      } else {
        throw new Error('unknown struct')
      }
      arr.push('}')
      res.push(...arr.filter(it => !!it), '')
    }
    return indentArr(indent, res)
  }
  createDeps(deps: Dependencies, indent: number) : string[] {
    let res: string[] = []
    for (let depName in deps) {
      res.push(`import * as ${depName} from '${deps[depName].package}'`)
    }
    return indentArr(indent, res)
  }
}

export function indentArr(indent: number, arr: string[]) {
  return arr.map(it => '  '.repeat(indent) + it)
}

function toEnumValue(value: any) {
  if (typeof value === 'string') {
    return `'${value}'`
  }
  return value
}

function toFieldType(value: string) {
  return value
}
