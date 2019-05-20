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
				description: '认证服务',
				method: Method.GET,
				actions: {
					Login: <Action>{
						description: '用户登陆',
						request: 'user.LoginInput',
            response: 'UserInfo'
					},
				  Signup: {
						request: 'SignupInput',
						response: <Struct> {
							title: '登陆结果',
							fields: <Field[]>[
								{
									name: 'userId',
									type: 'number',
									title: '用户ID',
									description: '用户身份唯一标记'
								},
								{
									name: 'sexs',
									type: 'Sex[]',
								}
							]
						}
					}
				}
			}
		}
		structs = {
			Sex: <Struct> {
				title: '性别',
				description: '动物性别',
				enums: [
					{
						key: 'Male',
						value: 0,
						title: '男',
					},
					{
						key: 'Female',
						value: '1',
						title: '女',
						description: '磁性动物'
					}
				]
			},
			UserInfo: <Struct>{
				title: '用户信息',
				fields: <Field[]>[
					{
						name: "email",
						type: 'boolean',
						validators: <Validator[]>[
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
