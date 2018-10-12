<template>
  <div class="contract-editor">
    <h2>包信息</h2>
    <table>
      <tbody>
        <tr>
          <td>title</td>
          <td><input type="text" v-model="savml.title"></td>
        </tr>
        <tr>
          <td>package</td>
          <td><input type="text" v-model="savml.package"></td>
        </tr>
        <tr>
          <td>version</td>
          <td><input type="text" v-model="savml.version"></td>
        </tr>
        <tr>
          <td>description</td>
          <td><textarea v-model="savml.description"></textarea></td>
        </tr>
      </tbody>
    </table>
    <h2>依赖</h2>
    <table>
      <thead>
        <th>package</th>
        <th>version</th>
        <th>alias</th>
      </thead>
      <tbody>
        <tr v-for="it in savml.dependencies">
          <td><input type="text" v-model="it.name"></td>
          <td><input type="text" v-model="it.version"></td>
          <td><input type="text" v-model="it.alias"></td>
        </tr>
      </tbody>
    </table>
    <h2>模块</h2>
    <table>
      <thead>
        <th>name</th>
        <th>title</th>
        <th>auth</th>
        <th>method</th>
      </thead>
      <tbody>
        <tr v-for="it in savml.modules">
          <td><input type="text" v-model="it.name"></td>
          <td><input type="text" v-model="it.title"></td>
          <td><input type="text" v-model="it.auth"></td>
          <td><input type="text" v-model="it.method"></td>
        </tr>
      </tbody>
    </table>
    <h2>接口</h2>
    <table>
      <thead>
        <th>name</th>
        <th>title</th>
        <th>auth</th>
        <th>method</th>
        <th>module</th>
        <th>path</th>
        <th>request</th>
        <th>response</th>
      </thead>
      <tbody>
        <tr v-for="it in savml.services">
          <td><input type="text" v-model="it.name"></td>
          <td><input type="text" v-model="it.title"></td>
          <td><input type="text" v-model="it.auth"></td>
          <td><input type="text" v-model="it.method"></td>
          <td><input type="text" v-model="it.module"></td>
          <td><input type="text" v-model="it.path"></td>
          <td><input type="text" v-model="it.request"></td>
          <td><input type="text" v-model="it.response"></td>
        </tr>
      </tbody>
    </table>
    <h2>结构</h2>
    <table>
      <thead>
        <th>name</th>
        <th>title</th>
        <th>props</th>
      </thead>
      <tbody>
        <tr v-for="it in savml.structs">
          <td><input type="text" v-model="it.name"></td>
          <td><input type="text" v-model="it.title"></td>
          <td>
            <table>
              <tbody>
                <tr v-for="iter in it.props">
                  <td><input type="text" v-model="iter.name"></td>
                  <td><input type="text" v-model="iter.title"></td>
                  <td><input type="text" v-model="iter.type"></td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <h2>枚举</h2>
    <table>
      <thead>
        <th>name</th>
        <th>title</th>
        <th>enums</th>
      </thead>
      <tbody>
        <tr v-for="it in savml.enums">
          <td><input type="text" v-model="it.name"></td>
          <td><input type="text" v-model="it.title"></td>
          <td>
            <table>
              <tbody>
                <tr v-for="iter in it.enums">
                  <td><input type="text" v-model="iter.key"></td>
                  <td><input type="text" v-model="iter.value"></td>
                  <td><input type="text" v-model="iter.title"></td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <h2>列表</h2>
    <table>
      <thead>
        <th>name</th>
        <th>title</th>
        <th>list</th>
      </thead>
      <tbody>
        <tr v-for="it in savml.lists">
          <td><input type="text" v-model="it.name"></td>
          <td><input type="text" v-model="it.title"></td>
          <td><input type="text" v-model="it.list"></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
  export default {
    props: {
      savml: {
        type: Object,
        default: () => {
          return {
            savml: "1.0",
            package: "com.contract.example",
            version: "1.0.1", 
            title: '', 
            description: '',
            dependencies: [
              { name: 'com.contract.account', version: 0.1, alias: "account" },
              { name: 'com.contract.user', version: 0.1, alias: "user" },
            ],
            modules: [
              { name: 'Account', title: '账户服务', auth: true },
              { name: 'Auth', title: '授权服务', auth: true, method: 'POST' },
            ],
            services: [
              { name: 'Login',
                title: '登录',
                auth: false,
                method: 'POST',
                module: 'Account',
                path: 'account/:login',
                request: 'LoginRequest',
                response: 'accountb.LoginResponse' },
              { name: 'Register',
                title: '注册',
                auth: false,
                method: 'POST',
                module: 'Account',
                path: 'account/:register',
                request: 'RegisterRequest',
                response: 'accountb.RegisterResponse' },
            ],
            enums: 
             [ { name: 'Sex',
                 title: '性别',
                 description: '用户性别只能是男或女?',
                 enums: 
                  [ { key: 'male', value: 1, title: '男' },
                    { key: 'female', value: 2, title: '女' } ] } ],
            structs: 
             [ { name: 'UserInfo',
                 title: '用户信息',
                 props: 
                  [ { name: 'userName',
                      title: '用户名',
                      type: 'String',
                      required: true,
                      checks: [ { name: 'chars' } ] },
                    { name: 'sex', title: '用户性别', type: 'Sex', optional: false },
                    { name: 'tags', title: '用户标签列表', type: 'StringList' } ] },
               { name: 'LoginRequest',
                 props: 
                  [ { field: 'userName', checks: [ { name: 'chars' } ] },
                    { name: 'password', title: '密码', type: 'String' },
                    { name: 'email', title: '邮箱', type: 'String', format: 'email' } ] } ],
            lists: 
             [ { name: 'UserInfoList', title: '用户列表', list: 'UserInfo' },
               { name: 'StringList', title: '字符串列表', list: 'String' } ],
            fields: [ { name: 'userName', title: '用户名', type: 'String' } ],
          }
        }
      }
    },
    components: {
    }
  }
</script>
