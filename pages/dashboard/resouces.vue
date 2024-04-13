<script setup lang="ts">
import type { ElTable } from 'element-plus'
import type { Tables } from '~/database.types'

const { resources, mutate, loading } = useResource({ random: false })
const search = ref('')

const deleteLoading = ref(false)
const activePayload = reactive<{ index: number | null, row: Tables<'resources'> | null }>({
  index: null,
  row: null,
})
function getDeleteLoading(index: number) {
  return deleteLoading.value && activePayload.index === index
}

const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<Tables<'resources'>[]>([])
const toggleSelection = (rows?: Tables<'resources'>[]) => {
  if (rows) {
    rows.forEach((row) => {
      // TODO: improvement typing when refactor table
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      multipleTableRef.value!.toggleRowSelection(row, undefined)
    })
  }
  else {
    multipleTableRef.value!.clearSelection()
  }
}
const handleSelectionChange = (val: Tables<'resources'>[]) => {
  multipleSelection.value = val
}

const handleEdit = async (index: number, row: Tables<'resources'>) => {
  console.log(index, row)
}

const handleDelete = async (index: number, row: Tables<'resources'>) => {
  activePayload.index = index
  activePayload.row = row

  await deleteResource(row.id + '')
}

async function handleDeleteBatch() {
  const ids = multipleSelection.value
  if (ids.length === 0) {
    ElMessage.error('请选择要删除的资源')
    return
  }

  await deleteResource(ids.map(d => d.id).join())
}

async function deleteResource(id: string) {
  try {
    deleteLoading.value = true
    const { data } = await useFetch('/api/resource', {
      method: 'DELETE',
      params: { id },
    })

    const resData = data.value
    if (resData && resData.ok) {
      ElMessage.success('删除成功')
      await mutate()
    }
  }
  catch (error) {
    ElMessage.error('删除失败')
    console.log(JSON.stringify(error, null, 2))
  }
  finally {
    deleteLoading.value = false
  }
}
</script>

<template>
  <div>
    <el-table
      ref="multipleTableRef"
      v-loading="loading"
      row-key="id"
      :data="resources"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
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
        prop="id"
        label="Id"
        width="60"
      />

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
            :loading="getDeleteLoading(scope.$index)"
            @click="handleDelete(scope.$index, scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-button @click="toggleSelection([resources[1], resources[2]])">
        Toggle selection status of second and third rows
      </el-button>
      <el-button @click="toggleSelection()">
        Clear selection
      </el-button>
      <el-button
        v-if="multipleSelection.length > 0"
        :loading="deleteLoading"
        type="danger"
        @click="handleDeleteBatch"
      >
        删除选中的 {{ multipleSelection.length }} 行
      </el-button>
    </div>
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
