
interface Dependency {
  package: string; // package name , eg: com.savml.package.a
  version: string; // package version, eg: 1.0
  name: string; // alias name
}

interface EnumItem {
  key: string | number | boolean; // key
  value: string | number | boolean; // value
  title: string; // display name
  description: string; // info
}

interface Enum {
  name: string; // enum name
  title: string; // display name
  description: string; // info
  fields: Array<EnumItem>; // fields
}

interface Validator {
  name: string; // name
  title: string; // display name
  args: Array<any>; // arguments
}

interface Check {
  name: string; // validater name
  title: string; // display name
  args: Array<any>; // arguments
}

interface Field {
  name: string; // name
  title: string; // display name
  description: string; // info
  type: string; // data type
  field: string; // name of reference field
  optional: boolean; // optional
  checks: Array<Check>; // validater check rulls
}

interface Struct {
  name: string; // name
  title: string; // display name
  description: string; // info
  fields: Array<Field>; // fields
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
  title: string; // display name
  description: string; // info
  path: string | undefined; // path of service
  auth: boolean | undefined; // authable
  method: Method | undefined; // method
}

interface Action {
  name: string; // name
  title: string; // display name
  description: string; // info
  path: string; // path of action
  service: string; // service name
  auth: boolean; // authable
  method: Method; // method
  request: string;
  response: string;
}

interface Page {
  name: string; // name
  title: string; // display name
  description: string; // info
  path: string; // path of page
}

interface Contract {
  contract: string; // required 1.0
  package: string; // required com.savml.package
  version: string; // required 1.0
  defaultLang: string; // required default language , eg: en
  lang: string; // current language, eg: en
  title: string; // required display name
  description: string; // info
  dependencies: Array<Dependency>; // package dependencies
  enums: Array<Enum>; // enum types
  structs: Array<Struct>; // struct types
  validators: Array<Validator>; // validators
  services: Array<Service>;
  actions: Array<Action>;
  pages: Array<Page>;
}

interface ContractContext {
  contract: Contract
  deps: Array<ContractContext>
}

export {
  EnumItem,
  Enum,
  Validator,
  Check,
  Field,
  Struct,
  Method,
  Service,
  Action,
  Page,
  Dependency,
  Contract,
  ContractContext
}
