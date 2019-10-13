<template>
  <ContractList/>
</template>
<script lang="ts">
import { Component, Provide, Vue } from "vue-property-decorator";
    
import  ContractList from '../components/ContractList.vue'

@Component({
  components: {
    ContractList
  }
})
export default class Home extends Vue {
  private contracts: object[] = [
    { contract: 'va.study.service.course', name: '课程服务'},
    { contract: 'va.study.service.dict', name: '字典服务'},
    { contract: 'va.study.service.homework', name: '作业服务'},
    { contract: 'va.study.service.volquiz', name: '试卷+题目服务'},
  ]
}

</script>