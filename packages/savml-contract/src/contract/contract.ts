
interface Dependency {
  package: string; // package name , eg: com.savml.package.a
  version: string; // package version, eg: 1.0
  name?: string; // alias name
}

interface EnumItem {
  key: string; // key
  value: string | number | boolean; // value
  title?: string; // display name
  description?: string; // info
}

interface Validator {
  name: string; // validater name
  args?: Array<any>; // arguments
  title?: string; // display name
  error?: string; // display error
}

interface FieldItem {
  name: string; // name
  title?: string; // display name
  description?: string; // info
  type?: string; // data type
  field?: string; // name of reference field
  optional?: boolean; // optional
  validators?: Array<Validator|string>; // validater check rulls
}

interface Struct {
  name: string; // name
  title?: string; // display name
  description?: string; // info
  fields?: Array<FieldItem>; // fields
  emums?: Array<EnumItem>; // enums
}

enum Method {
  GET = 'GET',
  POST = 'POST',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  HEAD = 'HEAD',
}

interface Service {
  name: string; // name
  title?: string; // display name
  description?: string; // info
  path?: string; // path of service
  auth?: boolean; // authable
  method?: Method; // method
  actions: Array<Action>; // actions
}

interface Action {
  name: string; // name
  title?: string; // display name
  description?: string; // info
  path?: string; // path of action
  auth?: boolean; // authable
  method?: Method; // method
  request?: Struct | string;
  response?: Struct | string;
}

interface Page {
  name: string; // name
  title?: string; // display name
  description?: string; // info
  path?: string; // path of page
  views: Array<View>; // views
}

interface View {
  name: string; // name
  title?: string; // display name
  description?: string; // info
  path?: string; // path of view
}

interface Contract {
  contract: string; // required 1.0
  package: string; // required com.savml.package
  version: string; // required 1.0
  defaultLang?: string; // required default language , eg: en
  lang?: string; // current language, eg: en
  title?: string; // required display name
  description?: string; // info
  dependencies?: Array<Dependency>; // package dependencies
  structs?: Array<Struct>; // struct types
  validators?: Array<Validator>; // validators
  services?: Array<Service>;
  pages?: Array<Page>;
}

interface ContractContext {
  contract: Contract
  deps: Array<ContractContext>
}

export {
  Validator,
  EnumItem,
  FieldItem,
  Struct,
  Method,
  Service,
  Action,
  Page,
  View,
  Dependency,
  Contract,
  ContractContext
}
