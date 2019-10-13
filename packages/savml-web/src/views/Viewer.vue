<template>
  <div class="contract-viewer">
    <ContractView :contract="contract" :versions="versions" v-on:changeVersion="changeVersion"></ContractView>
  </div>
</template>

<script lang="ts">
import { TContract } from 'savml'
import { Component, Provide, Vue } from "vue-property-decorator";
import { getFactory } from '../factory'
import ContractView from '../components/ContractView.vue'

Component.registerHooks([
  "beforeRouteUpdate",
])
@Component({
  components: {
    ContractView
  }
})
export default class Viewer extends Vue {
  async created() {
    let {contract, version} = this.$route.params
    getFactory().getContextFactory().context(contract, version || 'latest').then(res => {
      this.contract = res.contract()
    })
    await this.fetchVersions(contract)
    console.log('created')
  }
  beforeRouteUpdate(to: any, from: any, next: any) {
    let toParams = to.params
    let fromParams = from.params
    next()
    if (toParams.contract !== fromParams.contract) {
      this.fetchVersions(toParams.contract)
    }
    if (toParams.version !== fromParams.version) {
      this.fetchContract(toParams.contract, toParams.version)
    }
  }
  async fetchVersions(contract: string) {
    let versions = await fetch(`//npm.visionacademy.cn/${contract}`)
      .then(res => res.json())
      .then(res => Object.keys(res.versions))
    this.versions = versions
  }
  async fetchContract(contract: string, version: any) {
    getFactory().getContextFactory().context(contract, version || 'latest').then(res => {
      this.contract = res.contract()
    })
  }
  private versions: string[] = []
  changeVersion(params: any) {
    this.$router.push({
      name: 'viewer',
      params
    })
    console.log('xxx')
  }
  @Provide() private contract: TContract = null as unknown as TContract;
}
</script>
