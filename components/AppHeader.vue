<template>
  <nav class="nav">
    <div class="nav-wrap">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="1">
          Processing Center
        </el-menu-item>
        <el-sub-menu index="2">
          <template #title>
            Workspace
          </template>
          <el-menu-item index="2-1">
            资源管理
          </el-menu-item>
          <el-menu-item index="2-2">
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

const router = useRouter()
console.log(router)

const activeIndex = ref('1')
const handleSelect = (key: string) => {
  if (key === '1') {
    navigateTo('/')
  }
  if (key === '2') {
    navigateTo('/tasks')
  }
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
