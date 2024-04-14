<script setup lang="ts">
import type { Tables } from '~/database.types'

defineProps<{
  record: Tables<'resources'>
}>()

function openPage(url: string) {
  window.open(url)
}
</script>

<template>
  <div class="resource">
    <div class="header">
      <div class="logo">
        <img :src="record.icon">
      </div>
      <div class="title">
        <span
          class="title-txt"
          @click="openPage(record.url)"
        >{{ record.name }}</span>
      </div>
    </div>
    <div class="body">
      <template
        v-for="labelTxt in record.label"
        :key="labelTxt"
      >
        <div class="label">
          {{ labelTxt }}
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.resource {
  padding: 12px 8px;
  border: 3px solid #010101;
  border-radius: var(--radius-2);
  background-color: var(--surface-2);
}
.header {
  display: flex;
  align-items: center;
  gap: 16px;
}
.logo {
  width: 48px;
  flex-shrink: 0;
  img {
    border-radius: var(--radius-2);
  }
}
.title {
  color: var(--text-1);
  font-size: 16px;

  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  cursor: pointer;
}
.title:hover {
  color: var(--el-color-primary-light-3);
}
.body {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-block-start: 16px;
}
.label {
  font-size: 14px;
  padding: 5px 10px;
  border-radius: 3px;
  flex-shrink: 0;
  color: var(--text-2);
  background-color: var(--surface-3);
}
</style>
