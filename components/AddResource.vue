<template>
  <el-dialog
    v-model="open"
    @close="open = false"
  >
    <div class="header">
      <el-button
        :loading="parseLoading"
        @click="parseIcon"
      >
        从 URL 中解析图标
      </el-button>
    </div>
    <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="ruleForm"
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
      :size="formSize"
      status-icon
    >
      <el-form-item
        label="资源名称"
        prop="name"
      >
        <el-input v-model="ruleForm.name" />
      </el-form-item>

      <el-form-item
        label="资源链接"
        prop="url"
      >
        <el-input v-model="ruleForm.url" />
      </el-form-item>

      <el-form-item
        label="资源图标"
        prop="icon"
      >
        <el-input v-model="ruleForm.icon" />
      </el-form-item>

      <el-form-item
        label="资源标签"
        prop="label"
      >
        <el-select
          v-model="ruleForm.label"
          multiple
          filterable
          allow-create
          default-first-option
          :reserve-keyword="false"
          placeholder="请选择资源标签"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          :loading="loading"
          @click="submitForm(ruleFormRef)"
        >
          Create
        </el-button>
        <el-button @click="resetForm(ruleFormRef)">
          Reset
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { FetchError } from 'ofetch'

const open = defineModel('open', { type: Boolean, default: false })
const emit = defineEmits<{
  (e: 'ok'): void
}>()

interface RuleForm {
  name: string
  url: string
  icon: string
  label: string[]
}

const loading = ref(false)
const formSize = ref('default' as const)
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  name: '',
  url: '',
  icon: '',
  label: [],
})

const rules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: '请输入资源名称', trigger: 'change' },
  ],
  url: [
    { required: true, message: '请输入资源地址', trigger: 'change' },
    { type: 'url', message: '请输入正确的资源地址', trigger: 'change' },
  ],
  icon: [
    { required: true, message: '请输入资源图标', trigger: 'change' },
  ],
  label: [
    { required: true, message: '请输入资源标签', trigger: 'change' },
    { type: 'array', min: 1, message: '请输入至少一个标签', trigger: 'change' },
  ],
})

// parse
const parseLoading = ref(false)

async function parseIcon() {
  const url = ruleForm.url
  if (!url) {
    ElMessage.error('请输入资源地址')
    return
  }

  try {
    parseLoading.value = true
    const data = await $fetch('/api/data', {
      method: 'GET',
      params: { url },
    })

    if (data.ok) {
      ruleForm.icon = data.url
    }
  }
  catch (error) {
    if (error instanceof FetchError) {
      ElMessage.error(error.statusMessage)
    }
  }
  finally {
    parseLoading.value = false
  }
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      CreateResource()
    }
    else {
      console.log('error submit!', fields)
    }
  })
}

async function CreateResource() {
  try {
    loading.value = true
    const res = await $fetch('/api/resource', {
      method: 'POST',
      body: {
        ...ruleForm,
        categories: [44, 46],
      },
    })
    if (res.ok) {
      open.value = false
      ElMessage.success('创建成功')
      resetForm(ruleFormRef.value)
      emit('ok')
    }
  }
  catch (error) {
    if (error instanceof FetchError) {
      ElMessage.error(error.statusMessage)
    }
  }
  finally {
    loading.value = false
  }
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: flex-end;
  margin-block-start: 24px;
  margin-block-end: 24px;
}
</style>
