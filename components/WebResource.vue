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
        <img src="http://mockjs.com/assets/img/logo-2.svg">
      </div>
      <div class="title">
        {{ record.name }}
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
  padding: 16px 24px;
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
}
.title {
  color: var(--text-1);
  font-size: 16px;
}
.body {
  display: flex;
  gap: 8px;
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
