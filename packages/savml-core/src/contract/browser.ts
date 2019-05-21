import {Context, Service, Action} from '@savml/contract'

export class BrowserContext {
  constructor(private ctx: Context) {
  }
  async fetch(serviceName: string, actionName: string, input: any) : Promise<any> {
    let uri = this.getUri(serviceName, actionName)
    uri = this.makeUri(uri, input)
    //@TODO makeUri
    //@TODO check request
    //@TODO fetch
    //@TODO check response
  }
  makeUri(uri: string, input: any) : string {
    return uri.replace(/((:)\w+)/g, (key) => {
      return input[key.substr(1)].toString()
    })
  }
  getUri(serviceName: string, actionName: string) : string {
    let service :Service = <Service>(<any>this.ctx.contract.services)[serviceName]
    if (!service) {
      throw new Error(`service ${serviceName} no found`)
    }
    let action :Action = <Action>(<any>service.actions)[actionName]
    if (!action) {
      throw new Error(`service ${serviceName} has no action ${action}`)
    }
    let uri = typeof action.path === 'string' ? action.path : actionName
    let uriPrefix = typeof service.path === 'string' ? service.path : serviceName
    if (uri.length > 0 && (uri[0] !== '/')) {
      uri = uriPrefix + '/' + uri
    } else if (uri.length === 0){
      uri = uriPrefix
    }
    uri = uri.replace(/\/\//g, '/')
    return uri
  }
}
