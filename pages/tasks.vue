<script setup lang="ts">
import { dayjs } from 'element-plus';
import type { Database, Tables } from '~/database.types'
import type { FormInstance, FormRules } from 'element-plus'

const supabase = useSupabaseClient<Database>()
const { categories: originalCategories, loading, refreshCategories } = useCategories()

interface EditDialogForm {
  name: string;
}
const editDialogFormVisible = ref(false)
const editDialogFormRef = ref<FormInstance>()
const editDialogForm = reactive<EditDialogForm>({
  name: '',
})
const editDialogFormRules = reactive<FormRules<EditDialogForm>>({
  name: [
    { required: true, message: '请输入分类名称', trigger: ['blur', 'change'] },
  ],
})
const formLabelWidth = '140px'

const actionLoading = ref(false)
const updateLoading = ref(false)
const activeIndex = ref<number | undefined>()
const activeRow = ref<NestedCategory | undefined>()
function getActionLoading(index: number): boolean {
  return actionLoading.value && activeIndex.value === index
}

interface NestedCategory {
  id: number;
  name: string;
  level: number;
  createdAt: string;
  children?: NestedCategory[];
}

function convertToNestedListRecursive(items: Tables<'categories'>[]): NestedCategory[] {
  const result: NestedCategory[] = [];
  
  for (const item of items) {
    let targetParent = result.find(r => r.id === item.parent_id);

    if (!targetParent) {
      targetParent = { id: item.id, name: item.name, level: item.level, createdAt: item.created_at, children: [] };
      result.push(targetParent);
    }

    if (targetParent.id !== item.id) {
      if (!targetParent.children) {
        targetParent.children = [];
      }
      
      const nestedItem: NestedCategory = { id: item.id, name: item.name, level: item.level, createdAt: item.created_at, children: [] };
      targetParent.children.push(nestedItem);

      // 递归处理子节点
      const childItems = items.filter(i => i.parent_id === item.id);
      if (childItems.length > 0) {
        nestedItem.children = convertToNestedListRecursive(childItems);
      }
    }
  }

  // 返回所有顶级分类（parent_id 为 null 或 undefined）
  return result.filter(category => category.id !== null);
}

const search = ref('')
const nestedCategories = computed(() =>
  convertToNestedListRecursive(originalCategories.value)
)

async function onEditDialogFormSubmit(formEl: FormInstance | undefined) {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      editCategory(editDialogForm)
    } else {
      console.log('error submit!', fields)
    }
  })
}

async function editCategory(nextState: EditDialogForm) {
  const id = activeRow.value?.id
  if (!id) return

  try {
    updateLoading.value = true
    const { error } = await supabase
      .from('categories')
      .update(nextState)
      .eq('id', id)
      .select()

    if (error) {
      ElMessage.error(error.message)
    } else {
      ElMessage.success('更新成功')
      editDialogFormVisible.value = false
      await refreshCategories()
    }
  } catch (error) {} finally {
    updateLoading.value = false
    activeIndex.value = undefined
    activeRow.value = undefined
  }
}

const handleEdit = async (index: number, row: NestedCategory) => {
  activeIndex.value = index
  activeRow.value = row
  editDialogForm.name = row.name

  editDialogFormVisible.value = true
}

const handleDelete = async (index: number, row: NestedCategory) => {
  try {
    activeIndex.value = index
    actionLoading.value = true
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', row.id);
    
    if (error) {
      ElMessage.error(error.message)
    } else {
      ElMessage.success('删除成功')
      await refreshCategories()
    }
  } catch (error) {} finally {
    actionLoading.value = false
    activeIndex.value = undefined
  }
}

function addCategory() {
  navigateTo('/create-category')
}

function formatDate(date: string): string {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}
</script>

<template>
  <div>
    <el-button plain @click="addCategory">添加分类</el-button>

    <el-table row-key="id" v-loading="loading" :data="nestedCategories" style="width: 100%">
      <el-table-column prop="name" label="名称" width="180" />
      <el-table-column prop="level" label="类型" width="180" >
        <template #default="scope">
          <el-tag v-if="scope.row.level === 1" type="success">一级分类</el-tag>
          <el-tag v-else type="info">二级分类</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" >
        <template #default="scope">
          <span>{{ formatDate(scope.row.createdAt) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template #header>
          <el-input v-model="search" size="small" placeholder="Type to search" />
        </template>
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
            编辑
          </el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            :loading="getActionLoading(scope.$index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-dialog v-model="editDialogFormVisible" title="编辑分类名称" width="500">
    <el-form ref="editDialogFormRef" :model="editDialogForm" :rules="editDialogFormRules">
      <el-form-item label="分类名称" prop="name" :label-width="formLabelWidth">
        <el-input v-model="editDialogForm.name" autocomplete="off" placeholder="分类名称" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取消</el-button>
        <el-button type="primary" :loading="updateLoading" @click="onEditDialogFormSubmit(editDialogFormRef)">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog> 
</template>
