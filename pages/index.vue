<script setup lang="ts">
import mockjs from 'mockjs'

const createDialogOpen = ref(false)

const data = mockjs.mock({
  'list|40': [{
    'id|+1': 1,
    'name': '@cname',
    'age|18-25': 0,
    'address': '@county(true)',
    'date': '@datetime',
    'isMale': '@boolean',
    'isVip': '@boolean',
    'isAdmin': '@boolean',
    'isSuperAdmin': '@boolean',
    'isDeleted': '@boolean',
    'isDisabled': '@boolean',
    'isLocked': '@boolean',
    'isOnline': '@boolean',
  }],
})
</script>

<template>
  <div>
    <div class="header">
      <el-button
        type="primary"
        @click="createDialogOpen = true"
      >
        新增数据
      </el-button>
    </div>
    <div class="list">
      <template
        v-for="record of data.list"
        :key="record.id"
      >
        <WebResource />
      </template>
    </div>
    <CreateResource
      v-model:visible="createDialogOpen"
    />d
  </div>
</template>

<style scoped>
.header {
  margin-block-end: 16px;
  text-align: right;
}

.list {
  --grid-layout-gap: 16px;
  --grid-column-count: 8;
  --grid-item--min-width: 296px;
  --gap-count: calc(var(--grid-column-count) - 1);
  --total-gap-width: calc(var(--gap-count) * var(--grid-layout-gap));
  --grid-item--max-width: calc((100% - var(--total-gap-width)) / var(--grid-column-count));
  display: grid;
  grid-template-columns: repeat(auto-fill,minmax(max(var(--grid-item--min-width),var(--grid-item--max-width)),1fr));
  grid-gap: var(--grid-layout-gap);
}
</style>
