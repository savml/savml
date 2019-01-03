import {LoginRequest, AccountInfo} from './com.savml.service.account-types'

export function PostAccountLogin ({fetch}, input: LoginRequest) : Array<AccountInfo> {
  return fetch({}, input)
}

import {Service, Action} from '../../../src/contract'

const Account: Service = <Service>{
  name: "hello"
}

export default Account

export const Login : Action = <Action>{
  title: "登录"
}
