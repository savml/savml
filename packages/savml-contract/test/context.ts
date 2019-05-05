import test from 'ava'

import {ContractLoader} from '../src/loader/contractLoader'
import {FileLoader} from '../src/loader/fileLoader'
import {MemLoader} from '../src/loader/memLoader'

import {Contract, Dependency, Page, View, Service, Method, Struct} from '../src/contract/contract'

test('file loader should work', async t => {
	let ctxLoader = new ContractLoader()
	let fileLoader = new FileLoader([
		__dirname + '/fixtures/contract'
	])
	ctxLoader.addLoader(fileLoader)
	let res = await ctxLoader.fetch("com.savml.service.account")
	t.is(typeof res, 'object')

	res = await ctxLoader.fetch("com.savml.web.app")
	t.is(typeof res, "object")
	t.is(res.deps.length > 0, true)

})

test('mem loader should work', async t => {
	class MemContract implements Contract {
		contract = '1.0'
		package = 'com.savml.mem'
		version = '1.0'
		dependencies = <[Dependency]> [
			<Dependency>{
				package: "com.savml.mem2",
				version: "1.0.1"
			}
		]
		pages = <[Page]>[
			{
				name: "Account",
				views: <[View]>[
					<View>{
						name: "Login",
					}
				],
			}
		]
		services = <[Service]> [
			{
				name: "Auth",
				method: Method.GET
			}
		]
		structs = <[Struct]>[
			<Struct>{
				name: "UserInfo"
			}
		]
	}
	class Mem2Contract implements Contract {
		contract = "1.0"
		package = "com.savml.mem2"
		version = "1.0.1"
	}
	let ctxLoader = new ContractLoader()
	ctxLoader.addLoader(new MemLoader([new MemContract, new Mem2Contract]))
	
	let res = await ctxLoader.fetch("com.savml.mem")
	t.is(typeof res, "object")
	t.is(res.deps.length > 0, true)

})
