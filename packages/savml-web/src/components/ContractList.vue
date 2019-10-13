<template>
  <div>
    <div class="contract-header">合约列表</div>
    <ul class="contract-list">
      <li v-for="contract in contracts" :key="contract.contract"><router-link :to='{
        name:"viewer", 
        params:{
          contract: contract.contract
        }}'>{{contract.name}}</router-link></li>
    </ul>
  </div>
</template>
<script lang="ts">
import { Component, Provide, Vue } from "vue-property-decorator";

@Component
export default class ContractList extends Vue {
  private contracts: object[] = [
    { contract: 'va.study.service.course', name: '课程服务'},
    { contract: 'va.study.service.dict', name: '字典服务'},
    { contract: 'va.study.service.homework', name: '作业服务'},
    { contract: 'va.study.service.volquiz', name: '试卷+题目服务'},
  ]
}

</script>
<style lang="scss">
  .contract-header {
    margin: 20px;
    color: #4f5959;
    font-weight: 200;
  }
  .contract-list {
    list-style-type: none;
    a {
      color: #4f5959;
      text-decoration: none;
      cursor: pointer;
    }
  }
</style>