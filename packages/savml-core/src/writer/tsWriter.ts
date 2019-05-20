import {Context, Service, Services, Actions, Action} from '@savml/contract'

export class TsWriter {
  create(ctx: Context) {
    const {services} = ctx.contract
    const opts = {
      indent: 0
    }
    if (services) {
      let arr = this.createServices(services, opts.indent)
      console.log(arr)
    }
  }
  createServices(services: Services, indent : number) : string[] {
    let res : string[] = []
    for(let serviceName in services) {
      let service : Service = services[serviceName]
      if (service.name){
        serviceName = service.name
      }
      //@TODO add comments
      let arr = [
        `export interface ${serviceName} {`
      ]
      if (service.actions) {
        arr.push(...this.createActions(service.actions, 1))
      }
      arr.push('}')
      res.push(...arr)
    }
    return indentArr(indent, res)
  }
  createActions(actions: Actions, indent: number) : string[]{
    let res : string[] = []
    for (let actionName in actions) {
      let action : Action = actions[actionName]
      if (action.name){
        actionName = action.name
      }
      //@TODO add comments
      let request = action.request ? `input: ${action.request}` : ''
      let response = action.response || 'void'
      let text = `${actionName}(${request}):Promise<${response}>;`
      res.push(text)
    }
    return indentArr(indent, res)
  }
}

export function indentArr(indent: number, arr: string[]) {
  return arr.map(it => '  '.repeat(indent) + it)
}

/**

export default {
  project...
  contracts: {

  },
  services: {
    UserService
  }
}

// 
export interface UserInput {
  id: string
}

// 
export interface UserOutput {
  id: string
  name: string
}

export interface UserService {
  login(input: LoginInput): Promise<LoginResult>
  getUserName(input: UserInput): Promise<UserOutput>
}

*/

