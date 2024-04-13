<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import type { Database } from '~/database.types'

const supabase = useSupabaseClient<Database>()

const { categories, loading: categoriesLoading, refreshCategories } = useCategories()

const loading = ref(false)

interface FirstCategoryRuleForm {
  name: string
}
const firstCategoryRuleFormRef = ref<FormInstance>()
const firstCategoryForm = reactive({
  name: '',
})
const firstCategoryDialogFormVisible = ref(false)
const formLabelWidth = '140px'
const firstCategoryFormRules = reactive<FormRules<FirstCategoryRuleForm>>({
  name: [
    { required: true, message: '请输入分类名称', trigger: ['blur', 'change'] },
  ],
})

interface RuleForm {
  firstCategory?: number
  secondCategory: string
}
const ruleFormRef = ref<FormInstance>()
const form = reactive<RuleForm>({
  firstCategory: undefined,
  secondCategory: '',
})
const rules = reactive<FormRules<RuleForm>>({
  firstCategory: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
  ],
  secondCategory: [
    {
      required: true,
      message: '请输入二级分类名称',
      trigger: 'change',
    },
  ],
})

function getBack() {
  navigateTo('/dashboard/categories')
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      createSecondCategory(form)
    }
    else {
      console.log('error submit!', fields)
    }
  })
}

async function createSecondCategory(payload: RuleForm) {
  loading.value = true
  try {
    const record = {
      name: payload.secondCategory,
      level: 2,
      parent_id: payload.firstCategory,
    }

    const { error } = await supabase
      .from('categories')
      .insert([record])
      .select()

    if (!error) {
      ruleFormRef.value?.resetFields()
      getBack()
    }
    else {
      ElMessage.error(error.message)
    }
  }
  catch (error) {
    console.log('error', error)
  }
  finally {
    loading.value = false
  }
}

async function onFirstCategoryRuleFormSubmit(formEl: FormInstance | undefined) {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      createFirstCategory(firstCategoryForm)
    }
    else {
      console.log('error submit!', fields)
    }
  })
}

async function createFirstCategory({ name }: FirstCategoryRuleForm) {
  loading.value = true
  try {
    const record = {
      name,
      level: 1,
    }

    const { data, error } = await supabase
      .from('categories')
      .insert([record])
      .select()

    if (!error) {
      firstCategoryDialogFormVisible.value = false
      firstCategoryRuleFormRef.value?.resetFields()
      await refreshCategories()
    }
    else {
      ElMessage.error(error.message)
    }

    console.log('addCategory-data', { data, error })
  }
  catch (error) {
    console.log('error', error)
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <div class="header">
      <div>新建分类</div>
      <el-button @click="firstCategoryDialogFormVisible = true">
        新增一级分类
      </el-button>
    </div>
    <el-form
      ref="ruleFormRef"
      :rules="rules"
      :model="form"
      label-position="top"
    >
      <el-form-item
        label="一级分类"
        prop="firstCategory"
      >
        <el-select
          v-model="form.firstCategory"
          :loading="categoriesLoading"
          placeholder="请选择一级分类名称"
        >
          <el-option
            v-for="item in categories"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="二级分类"
        prop="secondCategory"
      >
        <el-input
          v-model="form.secondCategory"
          placeholder="二级分类名称"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="loading"
          type="primary"
          @click="submitForm(ruleFormRef)"
        >
          创建
        </el-button>
        <el-button @click="getBack">
          取消
        </el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      v-model="firstCategoryDialogFormVisible"
      title="Shipping address"
      width="500"
    >
      <el-form
        ref="firstCategoryRuleFormRef"
        :model="firstCategoryForm"
        :rules="firstCategoryFormRules"
      >
        <el-form-item
          label="分类名称"
          prop="name"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="firstCategoryForm.name"
            autocomplete="off"
            placeholder="分类名称"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="firstCategoryDialogFormVisible = false">
            取消
          </el-button>
          <el-button
            type="primary"
            :loading="loading"
            @click="onFirstCategoryRuleFormSubmit(firstCategoryRuleFormRef)"
          >
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  margin-block-end: 24px;

  .el-button {
    margin-inline-start: auto;
  }
}
</style>
