import {Contract, ContractContext, Pages, Views, Page, View} from '../contract/contract'

export class TContractContext implements ContractContext {
    constructor(public contract: Contract, public deps: Array<ContractContext>) {
        this.updateName(['pages', 'services', 'validators', 'structs', 'dependencies'], this.contract)
        this.updateChildName(['views'], this.contract.pages)
        this.updateChildName(['actions'], this.contract.services)
    }
    updateChildName(fields: Array<string>, target: any) {
        if (!target) {
            return
        }
        fields.forEach(field => {
            Object.keys(target).forEach(key => {
                let items = target[key][field]
                if (items) {
                    Object.keys(items).forEach(key => {
                        items[key].name || (items[key].name = key)
                    })
                }
            })
        })
    }
    updateName(fields: Array<string>, target: any) {
        fields.forEach(field => {
            let items = target[field]
            if (items) {
                Object.keys(items).forEach(key => {
                    items[key].name || (items[key].name = key)
                })
            }
        })
    }
    getPages() : Page[] {
        let pages = <Pages>this.contract.pages
        return Object.keys(pages).map(pageKey => pages[pageKey])
    }
    getPageViews(page: Page) : View[] {
        if (page && page.views) {
            let views = <Views>page.views
            return Object.keys(views).map(key => views[key])
        }
        return []
    }
    walkPages (walker: (page: Page, ctx: ContractContext) => any) : any[] {
        let res : any[] = []
        if (!walker) {
            return res
        }
        let pages = <Pages>this.contract.pages
        if (pages) {
            Object.keys(pages).forEach(pageKey => {
                res.push(walker(pages[pageKey], <ContractContext>this))
            })
        }
        return res
    }
    walkViews (walker: (view: View, page: Page, ctx: ContractContext) => any) : any[] {
        let res : any[] = []
        if (!walker) {
            return res
        }
        let pages = <Pages>this.contract.pages
        if (pages) {
            Object.keys(pages).forEach(pageKey => {
                let page = pages[pageKey]
                let views = <Views>page.views
                if (views) {
                    Object.keys(views).forEach(viewKey => {
                        res.push(walker(views[viewKey], page,  <ContractContext>this))
                    })
                }
            })
        }
        return res
    }
}
