<script setup lang="ts">
const createDialogOpen = ref(false)

const { resources, mutate } = useResource({ random: false })
</script>

<template>
  <div class="dashboard">
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
        v-for="record of resources"
        :key="record.id"
      >
        <WebResource :record="record" />
      </template>
    </div>
    <ResourceController
      v-model:visible="createDialogOpen"
      use-type="create"
      @ok="mutate"
    />
  </div>
</template>

<style scoped>
.dashboard {
  padding: 24px;
}

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
