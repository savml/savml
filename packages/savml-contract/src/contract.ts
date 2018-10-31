
interface Dependency {
  package: string; // package name , eg: com.savml.package.a
  version: string; // package version, eg: 1.0
  name?: string; // alias name
}

interface EnumItem {
  key: any; // key
  value: any; // value
  title: string; // display name
  description?: string; // info
}

interface Enum {
  name: string; // enum name
  title: string; // display name
  description?: string; // info
  fields: Array<EnumItem>; // fields
}

interface Validater {
  name?: string; // name
  title?: string; // display name
  args: Array<any>; // arguments
}

interface Check {
  name: string; // validater name
  title?: string; // display name
  args?: Array<any>; // arguments
}

interface Field {
  name?: string; // name
  title?: string; // display name
  description?: string; // info
  type?: string; // data type
  optional?: boolean; // optional
  field?: string; // name of reference field
  checks?: Array<Check>; // validater check rulls
}

interface Struct {
  name: string; // name
  title: string; // display name
  description?: string; // info
  fields: Array<Field>; // fields
}

interface Contract {
  contract: string; // 1.0
  package: string; // com.savml.package
  version: string; // 1.0
  title: string; // display name
  description?: string; // info
  dependencies?: Array<Dependency>; // package dependencies
  enums?: Array<Enum>; // enum types
  structs?: Array<Struct>; // struct types
  validaters?: Array<Validater>; // validaters
}

export {
  EnumItem,
  Enum,
  Validater,
  Field,
  Struct,
  Dependency,
  Contract,
}