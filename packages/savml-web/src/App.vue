<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script lang="ts">
import { TContract } from 'savml'
import { Component, Provide, Vue } from "vue-property-decorator";

@Component
export default class App extends Vue {
}
</script>

<style lang="scss" scope>
  html, body {
    margin: 0;
  }
  #app {
    position:absolute;
    display: flex;
    flex-direction: column;
    left: 0;
    bottom: 0;
    top: 0;
    right: 0;
  }
  .app-nav {
    height: 40px;
    background-color: #ccc;
  }
</style>