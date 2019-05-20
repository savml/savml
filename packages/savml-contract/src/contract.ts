
/**
 * 包依赖
 */
export interface Dependency {
  /**
   * 依赖的包名称, 如 com.savml.contract
   */
  package: string;
  /**
   * 依赖的包版本, 如 1.0.1
   */
  version: string;
  /**
   * 本地引用别名, 如 contract
   */
  name?: string;
}

/**
 * 依赖包容器
 */
export interface Dependencies {
  [key: string] : Dependency
}

/**
 * 枚举项
 */
export interface Enum {
  /**
   * 枚举名称, 一定为字符串
   */
  key: string;
  /**
   * 枚举值
   */
  value: string | number | boolean;
  /**
   * 标题
   */
  title?: string;
  /**
   * 描述
   */
  description?: string;
}

/**
 * 验证器
 */
export interface Validator {
  /**
   * 验证器名称
   */
  name: string;
  /**
   * 参数列表
   */
  args?: Array<any>;
  /**
   * 标题
   */
  title?: string;
  /**
   * 错误信息表达式
   */
  error?: string;
  /**
   * 继承的验证器
   */
  extends?: string;
}

/**
 * 验证器容器
 */
export interface Validators {
  [key: string]: Validator
}

/**
 * 字段项
 */
export interface Field {
  /**
   * 字段名称
   */
  name: string;
  /**
   * 字段数据类型
   * @TODO 改成枚举辅助
   */
  type?: string;
  /**
   * 引用字段
   */
  field?: string;
  /**
   * 字段是否可选, 默认是必选字段
   */
  optional?: boolean;
  /**
   * 字段验证器列表
   */
  validators?: Array<Validator|string>;
  /**
   * 字段标题
   */
  title?: string;
  /**
   * 字段描述
   */
  description?: string;
  
}

/**
 * 结构
 */
export interface Struct {
  /**
   * 结构名称
   */
  name?: string;
  /**
   * 结构标题
   */
  title?: string;
  /**
   * 结构描述字符串
   */
  description?: string;
  /**
   * 结构字段列表
   */
  fields?: Array<Field>;
  /**
   * 结构枚举列表
   */
  enums?: Array<Enum>;
}

/**
 * 结构容器
 */
export interface Structs {
  [key: string] : Struct
}

/**
 * 方法
 */
export enum Method {
  GET = 'GET',
  POST = 'POST',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  HEAD = 'HEAD',
}

/**
 * 视图, 二级路由
 */
export interface View {
  /**
   * 视图名称
   */
  name?: string;
  /**
   * 视图路由
   */
  path?: string;
  /**
   * 视图标题
   */
  title?: string;
  /**
   * 视图描述字符串
   */
  description?: string;
}

/**
 * 视图容器
 */
export interface Views {
  [key:string] : View
}

/**
 * 页面, 一级路由
 */
export interface Page {
  /**
   * 页面名称
   */
  name?: string;
  /**
   * 页面路由
   */
  path?: string;
  /**
   * 页面标题
   */
  title?: string;
  /**
   * 页面描述字符串
   */
  description?: string;
  /**
   * 页面子视图
   */
  views?: Views;
}

/**
 * 页面容器
 */
export interface Pages {
  [key:string] : Page
}

/**
 * 请求动作
 */
export interface Action {
  /**
   * 请求名称
   */
  name?: string;
  /**
   * 请求标题
   */
  title?: string;
  /**
   * 请求描述
   */
  description?: string;
  /**
   * 请求路由
   */
  path?: string;
  /**
   * 是否开启认证, 如果为字符串则为认证类型
   */
  auth?: boolean|string; 
  /**
   * 请求方法, 默认是GET
   */
  method?: Method;
  /**
   * 请求入参
   */
  request?: Struct | string;
  /**
   * 请求出参
   */
  response?: Struct | string;
}

/**
 * 请求容器
 */
export interface Actions {
  [key: string] : Action
}

/**
 * 服务
 */
export interface Service {
  /**
   * 服务名称
   */
  name?: string;
  /**
   * 服务标题
   */
  title?: string;
  /**
   * 服务描述字符串
   */
  description?: string;
  /**
   * 服务路由
   */
  path?: string;
  /**
   * 服务是否开启认证
   */
  auth?: boolean|string;
  /**
   * 请求方法
   */
  method?: Method;
  /**
   * 服务请求列表
   */
  actions?: Actions;
}

/**
 * 服务容器
 */
export interface Services {
  [key: string] : Service
}

/**
 * 合约
 */
export interface Contract {
  /**
   * 合约的版本
   */
  contract: string;
  /**
   * 包名称
   */
  package: string;
  /**
   * 包版本
   */
  version: string;
  /**
   * 默认语言代码, 合约声明中默认使用的语言
   */
  defaultLang?: string;
  /**
   * 当前语言代码, 开启多语言时当前合约使用的语言
   */
  lang?: string;
  /**
   * 合约标题
   */
  title?: string;
  /**
   * 合约描述
   */
  description?: string;
  /**
   * 合约依赖项
   */
  dependencies?: Dependencies;
  /**
   * 定义的结构
   */
  structs?: Structs;
  /**
   * 定义的验证器
   */
  validators?: Validators;
  /**
   * 提供的服务
   */
  services?: Services;
  /**
   * 提供的页面
   */
  pages?: Pages;
}

/**
 * 带依赖的合约上下文
 */
export interface Context {
  /**
   * 合约提供者, 用于处理器做中间转换依据
   */
  provider: string
  /**
   * 当前合约
   */
  contract: Contract
  /**
   * 依赖的合约
   */
  deps: Array<Context>
}

/**
 * 合约加载器工厂
 */
export interface Factory {
  /**
   * 加载合约上下文
   * @param packageName 合约包名
   * @param version 合约版本
   * @param options 加载选择
   */
  fetch(packageName: string, version?:string, options?: object) : Promise<Context>;
  /**
   * 
   * @param loader 加载器
   * @param options 加载器选项, 传递给loader
   */
  addLoader(loader: Loader, options?: object) : any;
}

/**
 * 合约加载器
 */
export interface Loader {
  /**
   * 解析包路径
   * @param packageName 包名称
   * @param version 包版本
   * @returns 如果加载器可以处理该包, 需要返回非空字符串
   */
  resolve(packageName: string, version?:string) : Promise<string>;
  /**
   * 返回需要的合约
   * @param url 包路径
   * @param options 选项
   */
  fetch(url: string, options?: object) : Promise<Contract>;
}
