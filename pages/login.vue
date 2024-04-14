<script setup lang="ts">
import type { FormInstance, FormItemRule, FormRules } from 'element-plus'

const supabase = useSupabaseClient()

const loginLoading = ref(false)
const formSize = ref('default' as const)
const ruleFormRef = ref<FormInstance>()
interface RuleForm {
  email: string
}
const ruleForm = reactive<RuleForm>({
  email: '',
})

const emailJumpOpen = ref(false)

const emailValidator: FormItemRule['validator'] = (
  _, value, callback,
) => {
  const EMAIL_REGEXP = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  if (value === '') {
    callback(new Error('请输入邮箱地址'))
  }
  else if (EMAIL_REGEXP.test(value) === false) {
    callback(new Error('请输入正确的邮箱地址'))
  }
  else {
    callback()
  }
}
const rules = reactive<FormRules<RuleForm>>({
  email: [
    {
      required: true,
      trigger: 'change',
      validator: emailValidator,
    },
  ],
})

const signInWithOtp = async () => {
  if (!ruleForm.email) {
    alert('Please enter an email')
    return
  }

  try {
    loginLoading.value = true
    const { error } = await supabase.auth.signInWithOtp({
      email: ruleForm.email,
      options: {
        emailRedirectTo: 'http://localhost:3000/confirm',
      },
    })
    if (!error) {
      emailJumpOpen.value = true
    }
  }
  catch (error) {
  //
  }
  finally {
    loginLoading.value = false
  }
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      signInWithOtp()
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>

<template>
  <div>
    <el-form
      v-if="!emailJumpOpen"
      ref="ruleFormRef"
      style="max-width: 600px;margin: 0 auto;"
      :model="ruleForm"
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
      :size="formSize"
      status-icon
    >
      <el-form-item
        label="邮件地址"
        prop="email"
      >
        <el-input
          v-model="ruleForm.email"
          type="email"
          autocomplete="on"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :loading="loginLoading"
          @click="submitForm(ruleFormRef)"
        >
          登录
        </el-button>
        <el-button @click="resetForm(ruleFormRef)">
          重置
        </el-button>
      </el-form-item>
    </el-form>
    <div v-else>
      <el-button>
        请检查邮箱地址
      </el-button>
    </div>
  </div>
</template>
