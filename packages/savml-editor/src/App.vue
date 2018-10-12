<template>
  <div id="app">
    <contract-editor></contract-editor>
  </div>
</template>
<script>
  import ContractEditor from './components/ContractEditor.vue'
  export default {
    name: 'App',
    data: {
      msg: 'hello'
    },
    components: {
      ContractEditor
    },
    created () {
    }
  }
</script>

<style lang="sass">
  @import "../sass/app.sass"
</style>
