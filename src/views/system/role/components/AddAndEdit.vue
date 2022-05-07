<!--
 * @Autor: ll
 * @Date: 2022-04-24 10:47:26
 * @Description: 新增/编辑
-->

<template>
  <div class="dialog">
    <el-dialog
      v-model="dialogVisible"
      :title="(props.type === 'add' ? '新增' : '修改') + '角色'"
      :close-on-click-modal="false"
      width="400px"
      @open="handleOpen()"
      @closed="handleClosed()"
    >
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px" v-loading="loading">
        <div class="app-row">
          <el-form-item label="名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入名称" maxlength="16" />
          </el-form-item>
        </div>
        <div class="app-row">
          <el-form-item class="app-col" label="描述" prop="description">
            <el-input
              type="textarea"
              v-model="formData.description"
              placeholder="请输入描述"
              maxlength="128"
              :autosize="{ minRows: 3, maxRows: 3 }"
            />
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="handleCancel()">取 消</el-button>
          <el-button type="primary" @click="handleConfirm()" :loading="loading">确 认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import { roleGet, roleAdd, roleUpdate } from '../index.service'
import type { RoleForm } from '../index.type'
import type { AddEditType } from '@/service/common.type'
import type { FormInstance } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  id: {
    type: String,
    default: ''
  },
  type: {
    type: String as () => AddEditType,
    required: true
  },
  /** 新增/编辑完, 更新信息 */
  handleUpdateInfo: {
    type: Function,
    required: true
  }
})
const emits = defineEmits(['update:modelValue'])

/** 弹窗基础属性 */
const dialogVisible = ref(false)
watch(
  () => props.modelValue,
  (newVal) => {
    dialogVisible.value = newVal
  },
  {
    immediate: true
  }
)
/** 打开弹窗 */
const handleOpen = async (): Promise<void> => {
  if (props.type !== 'add') {
    try {
      loading.value = true
      const { data } = await roleGet({ id: props.id })
      formData.name = data.name
      formData.description = data.description
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }
}
/** 关闭弹窗 */
const handleClosed = (): void => {
  // 清空表单
  formRef.value?.resetFields()
  emits('update:modelValue', false)
}
/** 点击取消 */
const handleCancel = (): void => {
  dialogVisible.value = false
}

/** 表单部分 */
const formData = reactive<RoleForm>({
  name: '',
  description: ''
})
const formRules = reactive({
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
})
const formRef = ref<FormInstance>()

/** 点击确认 */
const loading = ref(false)
const handleConfirm = async (): Promise<void> => {
  try {
    if (!formRef.value) return
    await formRef.value.validate()
    let message = ''
    if (props.type === 'add') {
      await roleAdd(formData)
      message = '新增成功'
    } else {
      await roleUpdate({ ...formData, id: props.id })
      message = '编辑成功'
    }
    await props.handleUpdateInfo()
    $Notify({
      title: '消息',
      message,
      type: 'success'
    })
    handleCancel()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss"></style>
