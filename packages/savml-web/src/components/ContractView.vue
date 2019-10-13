<template>
  <div class="contract-view" v-if="!!contract">
    <div class="contract-nav">
      <!-- 合约部分 -->
      <ul class="menu-root">
        <!-- 信息 -->
        <li><h3 class="nav-title">包信息</h3></li>
        <dl class="kv-item">  
          <dt>包名</dt>  
          <dd>{{contract.package}}</dd>  
        </dl>
        <dl class="kv-item">  
          <dt>版本</dt>  
          <dd>
            <select v-model="contract.version" @change="changeVersion($event)">                                        
              <option :value="version" v-for="(version, id) in versions" :key="id">{{version}}</option>                                    
            </select>
          </dd>
        </dl> 
        <dl class="kv-item">  
          <dt>标题</dt>  
          <dd>{{contract.title}}</dd>  
        </dl> 
        <!-- 服务 -->
        <li><h3 class="nav-title">服务列表 <i>({{contract.services.length}})</i></h3></li>
        <ul class="menu-sub">
          <template v-for="(item) in contract.services">
            <li :key="item.name" class="menu-item">
              <a v-bind:href="'#services.' + item.name" class="sidebar-link" v-bind:title="item.description || item.title || item.name">
                {{ item.name }}
                <i v-if="sidebarShowTitle && item.title">{{ item.title }}</i>
                <i class="menu-badge">({{item.actions.length}})</i>
              </a>
              <ul class="menu-sub">
                <template v-for="(subitem) in item.actions">
                  <li :key="subitem.name" class="menu-item">
                    <a v-bind:href="'#services.' + item.name + '.' + subitem.name" class="sidebar-link"  v-bind:title="subitem.description || subitem.title || subitem.name">
                      {{ subitem.name }}
                      <i v-if="sidebarShowTitle && subitem.title">{{ subitem.title }}</i>
                    </a>
                  </li>
                </template>
              </ul>
            </li>
          </template>
        </ul>
        <!-- 结构 -->
        <li><h3 class="nav-title">数据结构 <i>({{contract.structs.length}})</i></h3></li>
        <ul class="menu-sub">
          <template v-for="(item) in contract.structs">
            <li :key="item.name" class="menu-item">
              <a v-bind:href="'#structs.' + item.name" class="sidebar-link" v-bind:title="item.description || item.title || item.name">
                {{ item.name }}
                <i v-if="sidebarShowTitle && item.title">{{ item.title }}</i>
              </a>
            </li>
          </template>
        </ul>
        <!-- 视图 -->
        <li><h3 class="nav-title">页面视图 <i>({{contract.pages.length}})</i></h3></li>
        <ul class="menu-sub">
          <template v-for="(item) in contract.pages">
            <li :key="item.name" class="menu-item">
              <a class="sidebar-link"  v-bind:title="item.description || item.title || item.name">
                {{ item.name }}
                <i v-if="sidebarShowTitle && item.title">{{ item.title }}</i>
                <i class="menu-badge">({{item.views.length}})</i>
              </a>
              <ul class="menu-sub">
                <template v-for="(subitem) in item.views">
                  <li :key="subitem.name" class="menu-item">
                    <a class="sidebar-link"  v-bind:title="subitem.description || subitem.title || subitem.name">
                      {{ subitem.name }}
                      <i v-if="sidebarShowTitle && subitem.title">{{ subitem.title }}</i>
                    </a>
                  </li>
                </template>
              </ul>
            </li>
          </template>
        </ul>
      </ul>
    </div>
    <div class="contract-content">
      <!-- 内容区域 -->
      <section class="section-item">
        <h3 class="section-title">服务列表</h3>
        <template v-for="service in contract.services" >
          <section class="section-detail" :key='service.name' v-bind:id="'services.'+ service.name">    
            <h4 class="section-title">{{service.name}}<span class="hash-link" @click="toHash('#services.'+ service.name)">#</span></h4>
            <dl class="kv-item">  
              <dt>标题</dt>  
              <dd>{{service.title}}</dd>  
            </dl>
            <dl class="kv-item">  
              <dt>描述</dt>  
              <dd>{{service.description}}</dd>  
            </dl>
            <dl class="kv-item">  
              <dt>接口</dt>  
              <dd>
                <table class="table">
                  <tr>
                    <th>名称</th>
                    <th>方法</th>
                    <th>路径</th>
                    <th>输入</th>
                    <th>输出</th>
                    <th>标题</th>
                  </tr>
                  <tr v-for="action in service.actions" :key="action.name">
                    <td v-bind:id="'services.' + service.name + '.' + action.name">{{action.name}}</td>
                    <td>{{action.method || 'POST'}}</td>
                    <td>{{action.path}}</td>
                    <td><a v-bind:href="'#structs.' + action.request" v-if="action.request">{{action.request}}</a></td>
                    <td><a v-bind:href="'#structs.' + action.response" v-if="action.response">{{action.response}}</a></td>
                    <td>{{action.title}}</td>
                  </tr>
                </table>
              </dd>
            </dl>
          </section>
        </template>
      </section>
      <section>
        <h3 class="section-title">数据结构</h3>
        <template v-for="struct in contract.structs" >
          <section class="section-detail" :key='struct.name' v-bind:id="'structs.'+ struct.name">
            <h4 class="section-title">{{struct.name}}<span class="hash-link" @click="toHash('#structs.'+ struct.name)">#</span></h4>
            <dl class="kv-item">  
              <dt>标题</dt>  
              <dd>{{struct.title}}</dd>  
            </dl>
            <dl class="kv-item">  
              <dt>描述</dt>  
              <dd>{{struct.description}}</dd>  
            </dl>
            <dl class="kv-item">  
              <dt>字段</dt>  
              <dd>
                <table class="table">
                  <tr>
                    <th width="250">名称</th>
                    <th width="250">类型</th>
                    <th width="50">必须</th>
                    <th>标题</th>
                  </tr>
                  <tr v-for="field in struct.fields" :key="field.name">
                    <td>{{field.name}}</td>
                    <td>
                      <a v-if="isRef(field)" v-bind:href="'#structs.'+ getRef(field)">{{field.type}}</a>
                      <span v-else>{{field.type}}</span>
                    </td>
                    <td>{{!field.optional}}</td>
                    <td>{{field.title}}</td>
                  </tr>
                </table>
              </dd>  
            </dl>
          </section>
        </template>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { TContract, TField } from 'savml'
import { Component, Prop, Vue} from "vue-property-decorator";

const simpleTypes = [
  'number',
  'string',
  'boolean',
  'int',
  'int32',
  'int64',
  'uint',
  'uint32',
  'uint64',
]

@Component
export default class ContractView extends Vue {
  @Prop() private contract!: TContract;
  @Prop() private versions!: string[];
  @Prop() sidebarShowTitle?: boolean;
  get infos () {
    let that : any = this
    if (!that.contract) {
      return []
    }
    return ['package', 'version', 'description'].map((name) => {
      return {
        key: name,
        value: that.contract[name]
      }
    })
  }
  isRef(field: TField) {
    if (field.type) {
      let type = (field.type.indexOf('[') !== -1) ? field.type.substr(0, field.type.length -2) : field.type
      if (simpleTypes.indexOf(type.toLowerCase()) === -1) {
        return true
      }
    }
  }
  getRef(field: TField) {
    if (field.type) {
      let type = (field.type.indexOf('[') !== -1) ? field.type.substr(0, field.type.length -2) : field.type
      if (simpleTypes.indexOf(type.toLowerCase()) === -1) {
        return type
      }
    }
  }
  toHash (hash: string) {
    location.hash = hash
  }
  changeVersion($event: any) {
    this.$emit('changeVersion', {
      contract: this.contract.package,
      version: $event.target.value
    })
  }
}
</script>
<style lang="scss">
  .contract-view {
    display: flex;
    flex-direction: row;
    .contract-nav {
      display: flex;
      background-color: #f1f2f59e;
      padding-right: 10px;
    }
    .contract-content {
      display: flex;
      flex: 1;
      margin: 20px;
      flex-direction: column;
    }
    .contract-group-title {
      margin: 10px 0;
      padding-left: 40px;
      color: #b1b1b1;
    }
    .contract-list {
      list-style: none;
      padding-top: 20px;
      padding-bottom: 20px;
      width: 200px;
      font-size: 16px;
    }
  }
  .menu-root {
    list-style-type: none;
    margin: 0;
    line-height: 1.5em;
    li {
      margin-top: 0.5em;
    }
    ul {
      list-style-type: none;
      margin: 0;
      line-height: 1.5em;
      padding-left: 1em;
    }
    h3 > i {
      font-size: 12px;
    }
    .sidebar-link {
      color: #4f5959;
      text-decoration: none;
      cursor: pointer;
      &:hover {
        border-bottom: 2px solid #42b983;
      }
      &.current {
        font-weight: bold;
        color: #42b983;
      }
      i {
        font-size: 12px;
      }
    }
  }

  .kv-item {
    display: flex;
    color: #4f5959;
    font-size: 16px;
    margin: 5px 0;
    > dt {
      margin-left: 20px;
      width: 40px;
    }
    > dd {
      flex: 1;
    }
  }

  .section-title {
    color: #4f5959;
  }

  .nav-title {
    color: #4f5959;
    font-weight: 200; 
  }

  .table {
    border-spacing: 0;
    min-width: 100%;
    font-size: 15px;
    color: #34495e;
    border-collapse:collapse;

    th {
      background-color: #f3f3f3;
      text-align: left;
      padding: 8px;
      font-weight: 400;
      border-bottom: 1px solid #eee;
    }
    td {
      text-align: left;
      padding: 8px;
      border-bottom: 1px solid #eee;
      white-space:nowrap;
      text-overflow: ellipsis;
    }
  }

  .section-item {
     width: 100%; 
     overflow-x:scroll; 
  }

  .hash-link {
    color: #45b984;
    display: none;
    margin-left: 5px;
    cursor: pointer;
  }

  .section-title:hover .hash-link,
  .nav-title:hover .hash-link {
    display: inline;
  }

  .section-detail {
    margin-top: 10px;
    padding: 5px 5px;
  }

</style>