import {parse} from './parser'
import {validator} from './validator'
import {FileLoader} from './fileLoader'
import { Contract } from './contract';

export {parse, validator}

let out = {
  "contract": "1.0",
  "package": "com.savml.service.account",
  "version": "1.0",
  "title": "test package",
  "defaultLang": "en",
  "dependencies": [
    {
      "package": "com.savml.service.auth",
      "version": "1.0",
      "name": "authService"
    }
  ],
  "enums": [
    {
      "name": "Sex",
      "title": "性别",
      "fields": [
        {
          "key": "male",
          "value": 1,
          "title": "男"
        }
      ]
    }
  ],
  "structs": [
    {
      "name": "User",
      "title": "用户",
      "fields": [
        {
          "name": "sex",
          "title": "性别",
          "description": "用户的性别",
          "type": "Sex",
          "optional": true
        }
      ]
    }
  ]
}

validator(out)

let loader = new FileLoader()

loader.fetch('../../../doc/spec.yml').then((res: Contract) => {
  console.log(res)
})
