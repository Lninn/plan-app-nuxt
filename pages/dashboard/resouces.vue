<script setup lang="ts">
import type { ElTable } from 'element-plus'
import { dayjs } from 'element-plus'
import type { Tables } from '~/database.types'

const addOpen = ref(false)

const updateDialogOpen = ref(false)
const updateDialogRef = ref<{ setFormValue: (value: Tables<'resources'>) => void }>()
const { resources, mutate, loading } = useResource({ random: false })
const search = ref('')

const currentPage = ref(1)
const pageSize = ref(15)
const total = ref(0)

const filterResource = computed(() => {
  return resources.value.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value)
})

watchEffect(() => {
  const list = resources.value

  const count = list.length
  total.value = count
})

// 获取所有的标签，不能有重复的值
const label = computed(() => {
  const labels = resources.value.map(d => d.label).flat() ?? []
  return [...new Set(labels)]
})

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
  activePayload.index = index
  activePayload.row = row

  updateDialogRef.value?.setFormValue(row)
  updateDialogOpen.value = true
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
    const data = await $fetch('/api/resource', {
      method: 'DELETE',
      params: { id },
    })

    if (data.ok) {
      ElMessage.success('删除成功')
      await mutate()
    }
  }
  catch (error) {
    ElMessage.error('删除失败')
  }
  finally {
    deleteLoading.value = false
  }
}

function formatDate(date: string): string {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}
</script>

<template>
  <div>
    <div class="header">
      <el-button @click="mutate">
        刷新列表
      </el-button>
      <el-button @click="addOpen = true">
        数据录入
      </el-button>
    </div>
    <el-table
      ref="multipleTableRef"
      v-loading="loading"
      row-key="id"
      :data="filterResource"
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
        width="200"
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
        width="100"
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
          <span>{{ formatDate(scope.row.created_at) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template #header>
          <el-input
            v-model="search"
            placeholder="Type to search"
          />
        </template>
        <template #default="scope">
          <el-button
            @click="handleEdit(scope.$index, scope.row)"
          >
            编辑
          </el-button>
          <el-popconfirm
            :title="`确定删除 \`${scope.row.name}\` 吗？`"
            confirm-button-text="确定"
            cancel-button-text="取消"
            @confirm="handleDelete(scope.$index, scope.row)"
          >
            <template #reference>
              <el-button
                type="danger"
                :loading="getDeleteLoading(scope.$index)"
              >
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="currentPage"
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      class="paging"
      @current-change="handleCurrentChange"
    />
    <div style="margin-top: 20px">
      <el-button
        v-if="multipleSelection.length > 0"
        @click="toggleSelection([resources[1], resources[2]])"
      >
        Toggle selection status of second and third rows
      </el-button>
      <el-button
        v-if="multipleSelection.length > 0"
        @click="toggleSelection()"
      >
        Clear selection
      </el-button>

      <el-popconfirm
        v-if="multipleSelection.length > 0"
        :title="`确定删除选中的 ${multipleSelection.length} 行吗？`"
        confirm-button-text="确定"
        cancel-button-text="取消"
        @confirm="handleDeleteBatch"
      >
        <template #reference>
          <el-button
            :loading="deleteLoading"
            type="danger"
          >
            删除选中的 {{ multipleSelection.length }} 行
          </el-button>
        </template>
      </el-popconfirm>
    </div>
    <ResourceController
      ref="updateDialogRef"
      v-model:visible="updateDialogOpen"
      use-type="update"
      @ok="mutate"
    />
    <AddResource
      v-model:open="addOpen"
      :label="label"
      @ok="mutate"
    />
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: flex-end;
  margin-block-end: 16px;
}
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
.paging {
  padding-block: 16px;
  justify-content: flex-end;
}
</style>
