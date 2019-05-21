import test from 'ava'

import {ContractLoader} from '../loader/contractLoader'
import {MemLoader} from '../loader/memLoader'
import {TsWriter} from './tsWriter'

import {Contract, Page, View, Service, Method, Struct, Action, Field, Validator} from '@savml/contract'

test('tswriter should create project .ts', async t => {
	class MemContract implements Contract {
		contract = '1.0'
		package = 'com.savml.mem'
		version = '1.0'
		pages = {
			Account: <Page>{
				views: {
					Login: <View>{},
					Register: <View>{},
				}
			}
		}
		services = {
			Account: {
				actions: {
					Profile: <Action>{
						request: <Struct> {
							fields: <Field[]>[
								{
									name: "userName"
								},
								{
									name: "sex",
									type: "Sex",
								}
							]
						}
					}
				}
			},
			Auth: <Service>{
				description: '认证服务',
				method: Method.GET,
				actions: {
					Login: <Action>{
						description: '用户登陆',
            request: 'UserInfo'
					},
				  Signup: {
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
	let ctxLoader = new ContractLoader()
	ctxLoader.addLoader(new MemLoader([new MemContract]))
	
	let res = await ctxLoader.fetch("com.savml.mem")
	t.is(typeof res, "object")
  
  const ts = new TsWriter()
  let text = ts.createInterface(res)
	console.log(text);
	const fs = require('fs')
	fs.writeFileSync('./test/fixtures/test.ts', text)
	
})
