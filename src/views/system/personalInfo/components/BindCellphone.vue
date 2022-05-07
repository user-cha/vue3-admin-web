<!--
 * @Autor: wu
 * @Date: 2022-04-12 13:36:35
 * @Description: 绑定手机号
-->

<template>
  <div class="dialog">
    <el-dialog v-model="dialogVisible" title="修改账号" :close-on-click-modal="false" width="480px" @open="handleOpen()" @closed="handleClosed()">
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px" v-loading="loading">
        <div class="app-row">
          <el-form-item label="手机号" prop="cellphone">
            <el-input v-model.trim="formData.cellphone" placeholder="请输入手机号" maxlength="11" />
          </el-form-item>
        </div>
        <div class="app-row">
          <el-form-item label="验证码" prop="smsCode">
            <el-input v-model.trim="formData.smsCode" placeholder="请输入验证码" maxlength="6" />
          </el-form-item>
          <el-button
            type="primary"
            class="app-ml"
            :loading="codeLoading"
            :disabled="codeNum > 0 || !cellphoneRegExp.test(formData.cellphone)"
            @click="handleSendCode()"
          >
            {{ codeNum > 0 ? `倒计时${codeNum}秒` : '发送验证码' }}
          </el-button>
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
import { sendSms } from '@/service/common'
import { bindCellphone } from '../index.service'
import type { BindCellphoneForm } from '../index.type'
import type { FormInstance } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
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
const handleOpen = (): void => {
  // TODO
}
/** 关闭弹窗 */
const handleClosed = (): void => {
  // 清空表单
  formRef.value?.resetFields()
  // 清空验证码
  codeNum.value = 0
  clearInterval(codeFun)
  emits('update:modelValue', false)
}
/** 点击取消 */
const handleCancel = (): void => {
  dialogVisible.value = false
}

/** 表单部分 */
const formData = reactive<BindCellphoneForm>({
  cellphone: '',
  smsCode: ''
})
const cellphoneRegExp = /^1[3456789]\d{9}$/
const formRules = reactive({
  cellphone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: cellphoneRegExp, message: '请输入合法的手机号码', trigger: 'blur' }
  ],
  smsCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
})
const formRef = ref<FormInstance>()

/** 点击确认 */
const loading = ref(false)
const handleConfirm = async (): Promise<void> => {
  try {
    if (!formRef.value) return
    await formRef.value.validate()
    await bindCellphone(formData)
    await props.handleUpdateInfo()
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

/** 发送验证码 */
const codeNum = ref(0)
let codeFun: NodeJS.Timer
const codeLoading = ref(false)
const handleSendCode = async (): Promise<void> => {
  try {
    codeLoading.value = true
    await sendSms({
      type: 4,
      cellphone: Number(formData.cellphone)
    })
    codeNum.value = 120
    codeFun = setInterval(() => {
      codeNum.value--
      if (codeNum.value === 0) {
        clearInterval(codeFun)
      }
    }, 1000)
  } catch (error) {
    console.error(error)
  } finally {
    codeLoading.value = false
  }
}
</script>

<style scoped lang="scss"></style>
