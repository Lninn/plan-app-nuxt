<script setup lang="ts">
const createDialogOpen = ref(false)

const { resources, mutate } = useResource({ random: false })

const checkedMap = ref<Record<string, boolean>>({})

// 获取所有的标签，不能有重复的值
const label = computed(() => {
  const labels = resources.value.map(d => d.label).flat() ?? []
  return [...new Set(labels)]
})

const filterResource = computed(() => {
  const checkedMapCount = Object.keys(checkedMap.value).filter(name => checkedMap.value[name]).length
  if (checkedMapCount === 0) {
    return resources.value
  }

  return resources.value.filter((d) => {
    const label = d.label ?? []
    return label.some(name => checkedMap.value[name])
  })
})
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

    <div class="container">
      <div class="label-list">
        <template
          v-for="name in label"
          :key="name"
        >
          <el-check-tag
            :checked="checkedMap[name]"
            @change="v => checkedMap[name] = v"
          >
            {{ name }}
          </el-check-tag>
        </template>
      </div>

      <div class="list">
        <template
          v-for="record of filterResource"
          :key="record.id"
        >
          <WebResource :record="record" />
        </template>
      </div>
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
  flex-grow: 1;

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

.label-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-block-end: 16px;
}

.container {
  display: flex;
  flex-direction: column;
}
</style>
