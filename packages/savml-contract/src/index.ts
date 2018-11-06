import { parse } from './parser'
import { validator } from './validator'
import { FileLoader } from './fileLoader'
import { Contract } from './contract'
import { Loader } from './loader'
import { UrlLoader } from './urlLoader'
import { ContextLoader } from './context'

export { parse, validator }

let out = {
  'contract': '1.0',
  'package': 'com.savml.service.account',
  'version': '1.0',
  'title': 'test package',
  'defaultLang': 'en',
  'dependencies': [
    {
      'package': 'com.savml.service.auth',
      'version': '1.0',
      'name': 'authService'
    }
  ],
  'enums': [
    {
      'name': 'Sex',
      'title': '性别',
      'fields': [
        {
          'key': 'male',
          'value': 1,
          'title': '男'
        }
      ]
    }
  ],
  'structs': [
    {
      'name': 'User',
      'title': '用户',
      'fields': [
        {
          'name': 'sex',
          'title': '性别',
          'description': '用户的性别',
          'type': 'Sex',
          'optional': true
        }
      ]
    }
  ]
}

validator(out)

let ctxLoader = new ContextLoader()

let loader: Loader = new FileLoader([
  '../../../doc'
])

ctxLoader.addLoader(loader)

loader.resolve('spec').then(url => {
  console.log(url)
  loader.fetch(url, undefined).then((res: Contract) => {
    console.log('done', !!res)
  })
})

loader = new UrlLoader()
loader.fetch('http://localhost:8080/doc/spec.yml', undefined).then((res: Contract) => {
  console.log('done', !!res)
})

ctxLoader.fetch('spec').then(res => {
  console.log(res)
})
