<script setup lang="ts">
const model = defineModel({ type: String, required: true })
defineProps<{
  disabled: boolean
}>()

const isDefault = ref(false)
</script>

<template>
  <div>
    <el-switch
      v-model="isDefault"
      class="mb-2"
      style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
      inactive-text="默认图片"
      active-text="从 URL 解析"
      :disabled="disabled"
    />
    <el-input
      v-model="model"
      :disabled="isDefault"
      placeholder="请输入图片地址"
    />
    <div class="icon">
      <img :src="model">
    </div>
  </div>
</template>

<style scoped>
.icon {
  width: 100px;
  display: flex;

  img {
    min-width: 0;
  }
}
</style>
