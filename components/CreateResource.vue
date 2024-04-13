<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import mockjs from 'mockjs'
import type { Database } from '~/database.types'

const { cascaderCategories, getRandomCategory } = useCategories()

const supabase = useSupabaseClient<Database>()

const visible = defineModel('visible', { type: Boolean, default: false })
const loading = ref(false)

const emit = defineEmits<{
  (e: 'ok'): void
}>()

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
    { required: true, message: '请选择资源分类', trigger: 'change' },
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
  await formEl.validate((valid, fields) => {
    if (valid) {
      createResource(resourceForm)
    }
    else {
      console.log('error submit!', fields)
    }
  })
}

async function createResource(payload: ResourceForm) {
  try {
    loading.value = true
    const { error } = await supabase
      .from('resources')
      .insert([
        payload,
      ])
      .select()
    if (!error) {
      ElMessage.success('创建成功')
      visible.value = false
      resourceFormRef.value?.resetFields()
      emit('ok')
    }
    else {
      ElMessage.error(error.message)
    }
  }
  catch (error) {
    console.error(error)
  }
  finally {
    loading.value = false
  }
}

// 填充一个随机的资源
function fillRandomResource() {
  resourceForm.name = mockjs.mock('@ctitle')
  resourceForm.url = mockjs.mock('@url')

  const category = getRandomCategory()
  if (category) {
    resourceForm.categories = category
  }

  const label = mockjs.mock('@cword(3, 5)')
  resourceForm.label = [label]
}
</script>

<template>
  <el-dialog
    :model-value="visible"
    title="新建资源"
    width="500"
    @close="onClose"
  >
    <div class="header">
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
        />
      </el-form-item>
      <el-form-item
        label="图标"
        prop="icon"
      >
        <UrlIconPicker
          v-model="resourceForm.icon"
          placeholder="请输入资源图标"
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
          :loading="loading"
          @click="onConfirm(resourceFormRef)"
        >
          确认
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
