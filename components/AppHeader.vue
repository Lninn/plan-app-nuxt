<template>
  <nav class="nav">
    <div class="nav-wrap">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="index">
          Processing Center
        </el-menu-item>
        <el-sub-menu index="dashboard">
          <template #title>
            Workspace
          </template>
          <el-menu-item index="resouces">
            资源管理
          </el-menu-item>
          <el-menu-item index="categories">
            分类管理
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item
          index="3"
          disabled
        >
          TODO
        </el-menu-item>
      </el-menu>
    </div>

    <PreferenceSwitch />
    <el-popconfirm
      v-if="user"
      title="确定退出登录吗？"
      @confirm="logout"
    >
      <template #reference>
        <el-button
          type="primary"
        >
          退出
        </el-button>
      </template>
    </el-popconfirm>
  </nav>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const activeIndex = ref('index')
const handleSelect = (key: string, keyPath: string[]) => {
  let pagePath = keyPath.join('/')
  if (key === 'index') {
    pagePath = '/'
  }
  else {
    pagePath = `/${pagePath}`
  }

  navigateTo(pagePath)
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
  background-color: var(--el-menu-bg-color);
  padding: 0 24px;
}
.nav-wrap {
  flex-grow: 1;

  .el-menu {
    border-width: 0;
  }
}
</style>
