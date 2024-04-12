<script setup lang="ts">
const { categories, loading } = useCategories()

function addCategory() {
  navigateTo('/create-category')
}
</script>

<template>
  <div>
    <el-button plain @click="addCategory">添加分类</el-button>

    <el-table v-loading="loading" :data="categories" style="width: 100%">
      <el-table-column prop="name" label="名称" width="180" />
      <el-table-column prop="level" label="类型" width="180" />
      <el-table-column prop="created_at" label="创建时间" />
    </el-table>
  </div>
</template>
