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
      <div class="label">
        测表标签1
      </div>
      <div class="label">
        测表标签2
      </div>
      <div class="label">
        测表标签3
      </div>
    </div>
  </div>
</template>

<style scoped>
.resource {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
  background-color: #fff;
}
.header {
  display: flex;
  align-items: center;
}
.logo {
  width: 100px;
}
.title {
  font-size: 16px;
}
.body {
  display: flex;
  gap: 8px;
}
.label {
  padding: 3px 5px;
  border-radius: 3px;
  color: #fff;
  background-color: #666;
}
</style>
