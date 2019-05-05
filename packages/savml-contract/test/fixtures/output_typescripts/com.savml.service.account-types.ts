
/** 性别 */
export enum Sex {
  /** 性别: 男
   * 雄性高等动物 */
  male = 1,
  /** 性别: 女
   * 雌性高等动物 */
  female =2,
}

/** 用户信息 */
export interface AccountInfo {
  /** 年龄: 年龄需大于10岁 */
  age: Number
  /** 性别 */
  sex: Sex
  followers: Array<AccountInfo>
  father: AccountInfo
}

export interface LoginRequest {
  username: string
  password: string
}

export class AccountInfoFactory {
  create(input?: any) : AccountInfo {
    let res = {...input}
    return res
  }
}

const username = "username"
const password = "password"
const defaultString = ""

export function createLoginRequest(input?: any) : LoginRequest {
  return {
    [username]: defaultString,
    [password]: defaultString,
    ...input
  }
}
