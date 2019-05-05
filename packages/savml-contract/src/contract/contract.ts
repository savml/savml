
export interface Dependency {
  package: string; // package name , eg: com.savml.package.a
  version: string; // package version, eg: 1.0
  name?: string; // alias name
}

export interface Dependencies {
  [key: string] : Dependency
}

export interface Enum {
  key: string; // key
  value: string | number | boolean; // value
  title?: string; // display name
  description?: string; // info
}

export interface Validator {
  name: string; // validater name
  args?: Array<any>; // arguments
  title?: string; // display name
  error?: string; // display error
}

export interface Validators {
  [key: string]: Validator
}

export interface Field {
  name: string; // name
  title?: string; // display name
  description?: string; // info
  type?: string; // data type
  field?: string; // name of reference field
  optional?: boolean; // optional
  validators?: Array<Validator|string>; // validater check rulls
}

export interface Struct {
  name?: string; // name
  title?: string; // display name
  description?: string; // info
  fields?: Array<Field>; // fields
  enums?: Array<Enum>; // enums
}

export interface Structs {
  [key: string] : Struct
}

export enum Method {
  GET = 'GET',
  POST = 'POST',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  HEAD = 'HEAD',
}

export interface View {
  name?: string; // name
  title?: string; // display name
  description?: string; // info
  path?: string; // path of view
}

export interface Views {
  [key:string] : View
}

export interface Pages {
  [key:string] : Page
}

export interface Page {
  name?: string; // name
  title?: string; // display name
  description?: string; // info
  path?: string; // path of page
  views?: Views; // views
}

export interface Action {
  name?: string; // name
  title?: string; // display name
  description?: string; // info
  path?: string; // path of action
  auth?: boolean; // authable
  method?: Method; // method
  request?: Struct | string;
  response?: Struct | string;
}

export interface Actions {
  [key: string] : Action
}

export interface Service {
  name?: string; // name
  title?: string; // display name
  description?: string; // info
  path?: string; // path of service
  auth?: boolean; // authable
  method?: Method; // method
  actions?: Actions; // actions
}

export interface Services {
  [key: string] : Service
}

export interface Contract {
  contract: string; // required 1.0
  package: string; // required com.savml.package
  version: string; // required 1.0
  defaultLang?: string; // required default language , eg: en
  lang?: string; // current language, eg: en
  title?: string; // required display name
  description?: string; // info
  dependencies?: Dependencies; // package dependencies
  structs?: Structs; // struct types
  validators?: Validators; // validators
  services?: Services;
  pages?: Pages;
}

export interface ContractContext {
  contract: Contract
  deps: Array<ContractContext>
  walkPages (walker: (page: Page, ctx: ContractContext) => any) : any[];
  walkViews (walker: (view: View, page: Page, ctx: ContractContext) => any) : any[];
}
