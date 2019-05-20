import test from 'ava'

import {ContractLoader} from '../loader/contractLoader'
import {MemLoader} from '../loader/memLoader'
import {TsWriter} from './tsWriter'

import {Contract, Dependency, Page, View, Service, Method, Struct, Action, Field, Validator} from '@savml/contract'

test('tswriter should create project d.ts', async t => {
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
					Login: <Action>{
            response: 'UserInfo'
          },
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
  
  const ts = new TsWriter()
  ts.create(res)
  
})
