<template>
  <nav class="nav">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item index="1">
        主页
      </el-menu-item>
      <el-menu-item index="2">
        分类
      </el-menu-item>
      <el-menu-item
        index="3"
        disabled
      >
        TODO
      </el-menu-item>
    </el-menu>
    <div style="width: 100%;" />
    <preference-switch />

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
}
</style>
