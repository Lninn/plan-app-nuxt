<script setup lang="ts">
import type { Tables } from '~/database.types'

defineProps<{
  record: Tables<'resources'>
}>()
</script>

<template>
  <div class="resource">
    <div class="header">
      <div class="logo">
        <img :src="record.icon">
      </div>
      <div class="title">
        <a
          :href="record.url"
          target="_blank"
          :title="record.name"
        >{{ record.name }}</a>
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
  padding: 8px 16px;
  border: 1px solid var(--shadow-color);
  border-radius: var(--radius-2);
  background-color: var(--surface-2);
}
.header {
  display: flex;
  align-items: center;
  gap: 8px;
}
.logo {
  width: 72px;
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
}
.body {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-block-start: 8px;
}
.label {
  font-size: 12px;
  padding: 3px 5px;
  border-radius: 3px;
  flex-shrink: 0;
  color: var(--text-2);
  background-color: var(--surface-4);
}
</style>
