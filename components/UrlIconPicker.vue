<script setup lang="ts">
import mockjs from 'mockjs'

const model = defineModel({ type: String, required: true })

const isDefault = ref(true)

const img = mockjs.Random.image('160x160', '#4A7BF7')
const imgUrl = computed(() => isDefault.value ? img : 'https://cn.vuejs.org/logo.svg')

watchEffect(() => {
  model.value = isDefault.value ? img : 'https://cn.vuejs.org/logo.svg'
})
</script>

<template>
  <div>
    <el-switch
      v-model="isDefault"
      class="mb-2"
      style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
      inactive-text="默认图片"
      active-text="从 URL 解析"
    />
    <div class="icon">
      <img :src="imgUrl">
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
