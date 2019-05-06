import test from 'ava'

import {ContractLoader} from '../src/loader/contractLoader'
import {FileLoader} from '../src/loader/fileLoader'
import {MemLoader} from '../src/loader/memLoader'
import {ContractWriter} from '../src/writer/contractWriter'
import { VueRouteWriter } from "../src/writer/vueRouteWriter";

import {Contract, Dependency, Page, View, Service, Method, Struct, Action, Field, Validator, ContractContext} from '../src/contract/contract'

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
		dependencies = {
			mem2: <Dependency>{
				package: "com.savml.mem2",
				version: "1.0.1"
			}
		}
		pages = {
			Account: <Page>{
				views: {
					Login: <View>{},
					Register: <View>{},
				}
			}
		}
		services = {
			Auth: <Service>{
				method: Method.GET,
				actions: {
					Login: <Action>{},
				}
			}
		}
		structs = {
			UserInfo: <Struct>{
				fields: <[Field]>[
					{
						name: "email",
						validators: <[Validator]>[
							{ name: "isEmail", error: "不是邮箱格式"}
						],
					}
				]
			}
		}
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

test('vue route writer should work', async t => {
	class MemContract implements Contract {
		contract = '1.0'
		package = 'com.savml.mem'
		version = '1.0'
		pages = {
			Account: <Page>{
				views: {
					Login: <View>{
						path: 'signin'
					},
					Register: <View>{},
				}
			}
		}
	}
	let ctxLoader = new ContractLoader()
	ctxLoader.addLoader(new MemLoader([new MemContract]))
	
	let ctx : ContractContext = await ctxLoader.fetch("com.savml.mem")
	
	let writer = new ContractWriter()
	writer.addWriter(VueRouteWriter, {
		ts: true,
		filePath: __dirname + '/fixtures/output/'
	})

	let res = await writer.flush(ctx)
	t.is(res.length > 0, true)
	t.pass()
})
