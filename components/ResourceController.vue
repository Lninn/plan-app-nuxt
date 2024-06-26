<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import mockjs from 'mockjs'
import { FetchError } from 'ofetch'
import type { Tables } from '~/database.types'

const { cascaderCategories, getRandomCategory } = useCategories()

const visible = defineModel('visible', { type: Boolean, default: false })
const createLoading = ref(false)

const updateId = ref(-1)

const emit = defineEmits<{
  (e: 'ok'): void
}>()
const { useType } = defineProps<{
  useType: 'create' | 'update'
}>()
defineExpose({
  setFormValue(value: Tables<'resources'>) {
    updateId.value = value.id
    updateFormValues(value)
  },
})

interface ResourceForm {
  name: string
  url: string
  icon: string
  categories: number[]
  label: string[]
}

const resourceForm = reactive<ResourceForm>({
  name: '',
  url: '',
  icon: '',
  categories: [],
  label: [],
})

function updateFormValues(record: ResourceForm) {
  resourceForm.name = record.name
  resourceForm.url = record.url
  resourceForm.icon = record.icon
  resourceForm.categories = record.categories
  resourceForm.label = record.label
}

const resourceFormRef = ref<FormInstance>()
const resourceFormRules = reactive<FormRules<ResourceForm>>({
  name: [
    { required: true, message: '请输入资源名称', trigger: 'change' },
  ],
  url: [
    { required: true, message: '请输入资源URL', trigger: 'change' },
  ],
  icon: [
    { required: true, message: '请输入资源图标', trigger: 'change' },
  ],
  categories: [
    { required: true, message: '请选择资源分类', trigger: ['change', 'blur'] },
  ],
  label: [
    { required: true, message: '请选择资源标签', trigger: 'change' },
  ],
})

const cascaderProps = {
  expandTrigger: 'hover' as const,
}

function onClose() {
  visible.value = false
}

function onCancel() {
  onClose()
  resourceFormRef.value?.resetFields()
}

async function onConfirm(formEl: FormInstance | undefined) {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      if (useType === 'update') {
        updateResource(resourceForm)
      }
      else {
        createResource(resourceForm)
      }
    }
  })
}

async function updateResource(payload: ResourceForm) {
  const {
    name,
    categories,
    label,
    icon,
  } = payload
  try {
    createLoading.value = true
    const data = await $fetch('/api/resource', {
      method: 'PUT',
      body: {
        id: updateId.value,
        name,
        categories,
        label,
        icon,
      },
    })

    if (data.ok) {
      ElMessage.success('更新成功')
      visible.value = false
      resourceFormRef.value?.resetFields()
      emit('ok')
    }
  }
  catch (error) {
    if (error instanceof FetchError) {
      ElMessage.error(error.statusMessage)
    }
  }
  finally {
    createLoading.value = false
  }
}

async function createResource(payload: ResourceForm) {
  try {
    createLoading.value = true
    const data = await $fetch('/api/resource', {
      method: 'POST',
      body: payload,
    })

    if (data.ok) {
      ElMessage.success('创建成功')
      visible.value = false
      resourceFormRef.value?.resetFields()
      emit('ok')
    }
  }
  catch (error) {
    if (error instanceof FetchError) {
      ElMessage.error(error.statusMessage)
    }
  }
  finally {
    createLoading.value = false
  }
}

// 填充一个随机的资源
function fillRandomResource() {
  const randomResource: ResourceForm = {
    name: mockjs.mock('@ctitle'),
    url: mockjs.mock('@url'),
    icon: mockjs.Random.image('160x160', '#4A7BF7'),
    label: createRandomLabel(),
    categories: [],
  }
  const category = getRandomCategory()
  if (category) {
    randomResource.categories = category
  }

  updateFormValues(randomResource)

  // TODO 手动触发验证
  resourceFormRef.value?.validateField('categories')
}

function createRandomLabel(): string[] {
  const randomCount = getRandomIntInclusive(3, 5)

  const labels = []
  for (let i = 0; i < randomCount; i++) {
    const label = mockjs.mock('@cword(3, 5)')
    labels.push(label)
  }

  return labels
}

function getRandomIntInclusive(min: number, max: number) {
  const minCeiled = Math.ceil(min)
  const maxFloored = Math.floor(max)
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled) // The maximum is inclusive and the minimum is inclusive
}
</script>

<template>
  <el-dialog
    :model-value="visible"
    :title="useType === 'create' ? '新建资源' : '编辑资源'"
    width="500"
    @close="onClose"
  >
    <div
      v-if="useType === 'create'"
      class="header"
    >
      <el-button @click="fillRandomResource">
        填充随机资源
      </el-button>
    </div>
    <el-form
      ref="resourceFormRef"
      :model="resourceForm"
      :rules="resourceFormRules"
    >
      <el-form-item
        label="名称"
        prop="name"
      >
        <el-input
          v-model="resourceForm.name"
          placeholder="请输入资源名称"
        />
      </el-form-item>
      <el-form-item
        label="URL"
        prop="url"
      >
        <el-input
          v-model="resourceForm.url"
          placeholder="请输入资源URL"
          :disabled="useType === 'update'"
        />
      </el-form-item>
      <el-form-item
        label="图标"
        prop="icon"
      >
        <el-input
          v-if="useType === 'update'"
          v-model="resourceForm.icon"
        />
        <UrlIconPicker
          v-else
          v-model="resourceForm.icon"
          placeholder="请输入资源图标"
          :disabled="false"
        />
      </el-form-item>
      <el-form-item
        label="分类"
        prop="categories"
      >
        <el-cascader
          v-model="resourceForm.categories"
          :options="cascaderCategories"
          :props="cascaderProps"
          placeholder="请选择资源分类"
        />
      </el-form-item>
      <el-form-item
        label="标签"
        prop="label"
      >
        <el-select
          v-model="resourceForm.label"
          multiple
          filterable
          allow-create
          default-first-option
          :reserve-keyword="false"
          placeholder="请选择资源标签"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="onCancel">
          取消
        </el-button>
        <el-button
          type="primary"
          :loading="createLoading"
          @click="onConfirm(resourceFormRef)"
        >
          {{ useType === 'create' ? '创建' : '更新' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.header {
  text-align: right;
  margin: 16px 0;
}
</style>
