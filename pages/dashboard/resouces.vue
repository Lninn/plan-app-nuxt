<script setup lang="ts">
import type { Tables } from '~/database.types'

const { resources, loading } = useResource({ random: false })
const search = ref('')

const handleEdit = async (index: number, row: Tables<'resources'>) => {
  console.log(index, row)
}

const handleDelete = async (index: number, row: Tables<'resources'>) => {
  console.log(index, row)
}
</script>

<template>
  <div>
    <el-table
      v-loading="loading"
      row-key="id"
      :data="resources"
      style="width: 100%"
    >
      <el-table-column
        prop="name"
        label="名称"
      >
        <template #default="scope">
          <div class="name-column">
            <div class="avator-img">
              <img :src="scope.row.icon">
            </div>
            <div class="name-txt">
              {{ scope.row.name }}
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        prop="categories"
        label="分类"
      />

      <el-table-column
        prop="label"
        label="标签"
      />

      <el-table-column
        prop="createdAt"
        label="创建时间"
      >
        <template #default="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template #header>
          <el-input
            v-model="search"
            size="small"
            placeholder="Type to search"
          />
        </template>
        <template #default="scope">
          <el-button
            size="small"
            @click="handleEdit(scope.$index, scope.row)"
          >
            编辑
          </el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.avator-img {
  width: 40px;
  flex-shrink: 0;
}
.name-column {
  display: flex;
  align-items: center;
  gap: 8px;
}
.name-txt {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
