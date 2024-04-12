<template>
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
    <div style="width: 100%;"></div>
    <el-button type="primary" v-if="user" @click="logout" >退出</el-button>
  </nav>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const activeIndex = ref('1')
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

const client = useSupabaseClient()
const user = useSupabaseUser()

const logout = async () => {
  await client.auth.signOut()
  navigateTo('/')
}
</script>

<style>
.nav {
  display: flex;
  align-items: center;
  margin-block-end: 24px;
}
</style>
