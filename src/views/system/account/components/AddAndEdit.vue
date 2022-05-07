<!--
 * @Autor: wu
 * @Date: 2022-04-27 16:24:27
 * @Description: 新增/编辑
-->

<template>
  <div class="dialog">
    <el-dialog
      v-model="dialogVisible"
      :title="(props.type === 'add' ? '新增' : '修改') + '账号'"
      :close-on-click-modal="false"
      width="400px"
      @open="handleOpen()"
      @closed="handleClosed()"
    >
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px" v-loading="loading">
        <div class="app-row">
          <el-form-item label="角色" prop="roleIds">
            <el-select v-model="formData.roleIds" placeholder="请选择角色" clearable multiple>
              <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </div>
        <div class="app-row">
          <el-form-item label="账号" prop="account">
            <el-input v-model.trim="formData.account" placeholder="请输入账号" maxlength="16" autocomplete="new-password" />
          </el-form-item>
        </div>
        <div class="app-row">
          <el-form-item label="密码" prop="password">
            <el-input
              type="password"
              v-model.trim="formData.password"
              placeholder="请输入密码"
              maxlength="16"
              show-password
              autocomplete="new-password"
            />
          </el-form-item>
        </div>
        <div class="app-row">
          <el-form-item label="重复密码" prop="newPassword">
            <el-input
              type="password"
              v-model.trim="formData.newPassword"
              placeholder="请重复输入密码"
              maxlength="16"
              show-password
              autocomplete="new-password"
            />
          </el-form-item>
        </div>
        <div class="app-row">
          <el-form-item label="姓名" prop="realName">
            <el-input v-model.trim="formData.realName" placeholder="请输入姓名" maxlength="32" />
          </el-form-item>
        </div>
        <div class="app-row">
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="formData.gender">
              <el-radio :label="-1">保密</el-radio>
              <el-radio :label="1">男</el-radio>
              <el-radio :label="0">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="app-row">
          <el-form-item label="手机号码" prop="cellphone">
            <el-input v-model.trim="formData.cellphone" placeholder="请输入手机号码" maxlength="11" />
          </el-form-item>
        </div>
        <div class="app-row">
          <el-form-item label="电子邮箱" prop="email">
            <el-input v-model.trim="formData.email" placeholder="请输入电子邮箱" maxlength="32" />
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
import { accountGet, accountAdd, accountUpdate, accountRoleChooser } from '../index.service'
import type { AccountForm } from '../index.type'
import type { AddEditType, SelectOptions } from '@/service/common.type'
import type { FormInstance, FormRules } from 'element-plus'
import { fastAssignmentValue } from '@/utils/objectTool'

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
  try {
    loading.value = true
    await getRoleList()
    if (props.type !== 'add') {
      const { data } = await accountGet({ id: props.id })
      fastAssignmentValue(formData, data)
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
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
const formData = reactive<AccountForm>({
  id: '',
  account: '',
  password: '',
  newPassword: '',
  cellphone: '',
  email: '',
  realName: '',
  gender: -1,
  description: '',
  roleIds: []
})
const formRules = reactive<FormRules>({
  roleIds: [{ required: true, message: '请选择角色', trigger: 'change' }],
  account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请重复输入密码', trigger: 'blur' },
    {
      validator: (rule, value: string, callback) => {
        if (value !== formData.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  realName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  cellphone: [{ pattern: /^1[3456789]\d{9}$/, message: '请输入合法的手机号', trigger: 'blur' }],
  email: [{ pattern: /^([a-zA-Z\d])(\w|\-)+@[a-zA-Z\d]+\.[a-zA-Z]{2,4}$/, message: '请输入合法的邮箱', trigger: 'blur' }]
})
const formRef = ref<FormInstance>()

/** 点击确认 */
const loading = ref(false)
const handleConfirm = async (): Promise<void> => {
  try {
    if (!formRef.value) return
    await formRef.value.validate()
    let message = ''
    const params = { ...formData, roleIds: formData.roleIds.join(',') }
    if (props.type === 'add') {
      Reflect.deleteProperty(params, 'id')
      await accountAdd(params)
      message = '新增成功'
    } else {
      await accountUpdate(params)
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

/** 获取角色列表 */
const roleOptions = ref<SelectOptions[]>([])
const getRoleList = async (): Promise<void> => {
  const { data } = await accountRoleChooser()
  roleOptions.value = data.map((item) => {
    return { value: item.id, label: item.name }
  })
}
</script>

<style scoped lang="scss"></style>
