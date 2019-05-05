import { Writer } from "../contract/writer";
import { ContractContext, Views, View } from "../contract/contract";

export interface VuewRouteOptions {
    noDirty: boolean
    filePath: string // routes.js
    metas: string // auth, title
}

export const VueRouteWriter: Writer = async (ctx: ContractContext, opts: object) : Promise<any> => {
    let routes : any[] = []
    let components: any = {}

    let options = <VuewRouteOptions> opts
    let metas = options.metas ? options.metas.split(',').map(it => it.trim()) : []
    ctx.walkPages(page => {
        let children : any[] = []
        let views = <Views>page.views
        if (views) {
            Object.keys(views).forEach(viewKey => {
                let view : View = views[viewKey]
                let defined = view.path || (view.path === '')
                let route : any = {
                    component: `${page.name}${view.name}`,
                    name:  `${page.name}${view.name}`,
                    path: `${defined ? view.path : view.name}`
                }
                components[route.name] = {
                    file: `${page.name}/${view.name}`
                }
                setRouteMeta(route, metas, view)
                children.push(route)
            })
        }
        let defined = page.path || (page.path === '')
        let route : any = {
            component: page.name,
            name:  page.name,
            path: `${defined ? page.path : page.name}`,
        }
        components[route.name] = {
            file: `${route.name}/${route.name}`
        }
        if (children.length) {
            route.children = children
        }
        setRouteMeta(route, metas, page)
        routes.push(route)
    })
    // console.log(JSON.stringify(components, null, 2))
    // console.log(JSON.stringify(routes, null, 2))
    return routes
}

function setRouteMeta(route: any, metas: any[], view: any) {
    let meta : any = {}
    let fields = metas.filter(metaKey => {
        let ret = metaKey in view
        if (ret) {
            meta[metaKey] = (<any>view)[metaKey]
        }
        return ret
    })
    if (fields.length) {
        route.meta = meta
    }
}
