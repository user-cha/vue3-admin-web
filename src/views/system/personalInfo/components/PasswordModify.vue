<!--
 * @Autor: wu
 * @Date: 2022-04-11 17:03:00
 * @Description: 修改密码
-->

<template>
  <div class="dialog">
    <el-dialog v-model="dialogVisible" title="修改密码" :close-on-click-modal="false" width="400px" @open="handleOpen()" @closed="handleClosed()">
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px" v-loading="loading">
        <div class="app-row">
          <el-form-item label="当前密码" prop="password">
            <el-input type="password" v-model.trim="formData.password" maxlength="32" placeholder="请输入当前密码" show-password />
          </el-form-item>
        </div>
        <div class="app-row">
          <el-form-item label="新密码" prop="newPassword">
            <el-input type="password" v-model.trim="formData.newPassword" maxlength="32" placeholder="请输入新密码" show-password />
          </el-form-item>
        </div>
        <div class="app-row">
          <el-form-item label="重复密码" prop="rptPassword">
            <el-input type="password" v-model.trim="formData.rptPassword" maxlength="32" placeholder="请重复输入新密码" show-password />
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
import { setPassword } from '../index.service'
import type { PasswordForm } from '../index.type'
import type { FormInstance } from 'element-plus'
import type { InternalRuleItem } from 'async-validator'

const props = defineProps({
  modelValue: {
    type: Boolean,
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
const handleOpen = (): void => {
  //
}
/** 关闭弹窗 */
const handleClosed = (): void => {
  formRef.value?.resetFields()
  emits('update:modelValue', false)
}
/** 点击取消 */
const handleCancel = (): void => {
  dialogVisible.value = false
}

/** 表单部分 */
const formData = reactive<PasswordForm>({
  password: '',
  newPassword: '',
  rptPassword: ''
})
const formRules = reactive({
  password: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
  newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
  rptPassword: [
    { required: true, message: '请重复输入新密码', trigger: 'blur' },
    {
      validator: (_rule: InternalRuleItem, value: string, callback: (error?: string | Error) => void) => {
        if (value && value !== formData.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})
const formRef = ref<FormInstance>()

/** 点击确认 */
const loading = ref(false)
const handleConfirm = async (): Promise<void> => {
  try {
    if (!formRef.value) return
    await formRef.value.validate()
    await setPassword({ oldPwd: formData.password, newPwd: formData.newPassword })
    $Notify({
      title: '消息',
      message: '修改成功',
      type: 'success'
    })
    handleCancel()
  } catch (error) {
    console.error('await:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss"></style>
