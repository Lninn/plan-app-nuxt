<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'

const { cascaderCategories } = useCategories()

const visible = defineModel('visible', { type: Boolean, default: false })

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
const formLabelWidth = '100px'

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
      visible.value = false
      console.log('submit!', resourceForm)
    }
    else {
      console.log('error submit!', fields)
    }
  })
}
</script>

<template>
  <el-dialog
    :model-value="visible"
    title="新建资源"
    width="500"
    @close="onClose"
  >
    <el-form
      ref="resourceFormRef"
      :model="resourceForm"
      :rules="resourceFormRules"
    >
      <el-form-item
        label="名称"
        :label-width="formLabelWidth"
        prop="name"
      >
        <el-input
          v-model="resourceForm.name"
          placeholder="请输入资源名称"
        />
      </el-form-item>
      <el-form-item
        label="URL"
        :label-width="formLabelWidth"
        prop="url"
      >
        <el-input
          v-model="resourceForm.url"
          placeholder="请输入资源URL"
        />
      </el-form-item>
      <el-form-item
        label="图标"
        :label-width="formLabelWidth"
        prop="icon"
      >
        <UrlIconPicker
          v-model="resourceForm.icon"
          placeholder="请输入资源图标"
        />
      </el-form-item>
      <el-form-item
        label="分类"
        :label-width="formLabelWidth"
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
        :label-width="formLabelWidth"
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
          @click="onConfirm(resourceFormRef)"
        >
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
