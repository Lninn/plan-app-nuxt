<template>
  <AppContainer>
    <nav class="nav">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        >
          <el-menu-item index="1">主页</el-menu-item>
          <el-menu-item index="2">分类</el-menu-item>
          <el-menu-item index="3" disabled>TODO</el-menu-item>
      </el-menu>
    </nav>
    <NuxtPage />  
  </AppContainer>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const activeIndex = ref('1')
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<style>
body {
  margin: 0;
}
.nav {
  margin-block-end: 24px;
}
</style>
