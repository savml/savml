import { ContractContext, Writer } from "../contract/contract";
import {stringify} from 'json5';
import {writeFileAsync, readFileAsync, existsAsync } from 'tdash/cjs/fse';
import {tmpl} from 'tdash/cjs/tmpl'
import {ensureDir} from 'fs-extra'
import {dirname} from 'path'

export interface VuewRouteOptions {
    noDirty: boolean
    ts: boolean
    filePath: string // routes.js
    metas: string // auth, title
}

export const VueRouteWriter: Writer = async (ctx: ContractContext, opts: object) : Promise<any> => {
    let routes : any[] = []
    let components: any = {}

    let options = <VuewRouteOptions> opts
    let metas = options.metas ? options.metas.split(',').map(it => it.trim()) : []
    ctx.getPages().forEach(page => {
        let children : any[] = []
        ctx.getPageViews(page).forEach(view => {
            let defined = view.path || (view.path === '')
            let route : any = {
                component: `${page.name}${view.name}`,
                name:  `${page.name}${view.name}`,
                path: `${defined ? view.path : view.name}`
            }
            components[route.name] = {
                file: `${page.name}/${view.name}`,
                view: true,
                route,
            }
            setRouteMeta(route, metas, view)
            children.push(route)
        })
        let defined = page.path || (page.path === '')
        let route : any = {
            component: page.name,
            name:  page.name,
            path: `${defined ? page.path : page.name}`,
        }
        components[route.name] = {
            file: `${route.name}/${route.name}`,
            view: false,
            route,
        }
        if (children.length) {
            route.children = children
        }
        setRouteMeta(route, metas, page)
        routes.push(route)
    })
    await createRoute(routes, components, options)
    await writeVueFile(components, options)
    // console.log(JSON.stringify(components, null, 2))
    // console.log(JSON.stringify(routes, null, 2))
    return routes
}

function unique (arr: any[]) {
    return arr.filter((it, index) => arr.indexOf(it) === index)
}

async function createRoute(routes: any[], components: any, options: VuewRouteOptions) {
    let routeStr = stringify(routes, null, 2)
    let imports = Object.keys(components).map((name) => {
        return `import ${name} from './${components[name].file}'`
    })
    routeStr = routeStr.replace(/component:\s+'(\w+)'/g, (_, name) => {
        return `component: ${name}`
    })
    let content = unique(imports).concat(['']).concat(`export default ${routeStr}`).join('\n')
    let routePath = `${options.filePath}/routes.${options.ts ? 'ts': 'js'}`
    if (routePath) {
        if (await existsAsync (routePath)) {
          let oldText = await readFileAsync(routePath)
          if (oldText.toString() !== content) {
            await writeFileAsync (routePath, content)
          }
        } else {
          await writeFileAsync (routePath, content)
        }
    }
}

const vueTemplate = tmpl(`<template>
  <div>
    <h2>{%= state.route.name %}</h2>
{% if (!state.view) { %}    <router-view class="view-container"></router-view>{% } %}
  </div>
</template>
<script{% if (state.opts.ts) { %} lang="ts"{% } %}>
  export default {
    name: '{%=state.route.name%}',
    getters: [],
    actions: [],
    payload: [],
    data: () => {
      return {}
    }
  }
</script>
`)

async function writeVueFile (components: any, options: VuewRouteOptions) {
    return Promise.all(Object.keys(components).map(async it => {
        let comp = components[it]
        comp.opts = options
        let vueFile = `${options.filePath}/${comp.file}.vue`
        if (!await existsAsync(vueFile)) {
            await ensureDir(dirname(vueFile))
            let vueData = vueTemplate(comp)
            await writeFileAsync(vueFile, vueData)
        }
    }))
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
