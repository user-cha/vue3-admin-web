<!--
 * @Autor: ll
 * @Date: 2022-03-24 16:47:07
 * @Description: 企业信息
-->

<route>
{
  name: "systemEnterprise",
  meta: {
    icon: 'system-enterprise',
    title: "企业信息",
    sort: 2
  }
}
</route>

<template>
  <div class="app-container" v-loading="loading">
    <el-divider content-position="left"><h3>企业信息</h3></el-divider>
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
      <div class="app-row">
        <el-form-item class="app-col" label="Admin 账号" prop="adminUserAccount">
          {{ formData.adminUserAccount }}
        </el-form-item>
        <el-form-item class="app-col" label="Admin 姓名" prop="adminUserRelName">
          {{ formData.adminUserRelName }}
        </el-form-item>
      </div>
      <div class="app-row">
        <el-form-item class="app-col" label="企业名称" prop="name">
          <el-input v-if="editEnable" v-model="formData.name" maxlength="32" placeholder="请输入企业名称" />
          <span v-else>{{ formData.name || '--' }}</span>
        </el-form-item>
        <el-form-item class="app-col" label="联系人" prop="contacts">
          <el-input v-if="editEnable" v-model="formData.contacts" maxlength="32" placeholder="请输入联系人" />
          <span v-else>{{ formData.contacts || '--' }}</span>
        </el-form-item>
      </div>
      <div class="app-row">
        <el-form-item class="app-col" label="座机/手机" prop="telephone">
          <el-input v-if="editEnable" v-model="formData.telephone" maxlength="11" placeholder="请输入座机/手机" />
          <span v-else>{{ formData.telephone || '--' }}</span>
        </el-form-item>
        <el-form-item class="app-col" label="传真" prop="fax">
          <el-input v-if="editEnable" v-model="formData.fax" maxlength="32" placeholder="请输入传真" />
          <span v-else>{{ formData.fax || '--' }}</span>
        </el-form-item>
      </div>
      <div class="app-row">
        <el-form-item class="app-col" label="描述" prop="description">
          <el-input v-if="editEnable" v-model="formData.description" :rows="4" maxlength="500" type="textarea" placeholder="请输入描述" />
          <span v-else>{{ formData.description || '--' }}</span>
        </el-form-item>
      </div>
      <div class="app-row">
        <el-form-item label="LOGO" prop="description">
          <upload-image
            v-model:single="formData.logo"
            :disabled="!editEnable"
            width="220px"
            height="50px"
            tip="图片尺寸: 220px * 50px, 只能上传jpg/png/gif图片, 且不超过1MB"
            :size="1"
            :cropper-enable="cropperEnable"
          />
          <div v-if="editEnable" style="width: 100%">
            <el-checkbox v-model="cropperEnable" label="开启裁剪" />
          </div>
        </el-form-item>
      </div>
      <div class="app-row">
        <el-form-item v-if="editEnable">
          <el-button @click="handleCancel()">取消</el-button>
          <el-button type="primary" @click="handleConfirm()">确认</el-button>
        </el-form-item>
        <el-form-item v-else>
          <el-button @click="clickToModify()">修改</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { tenantGet, tenantUpdate } from './index.service'
import type { TenantInfo } from './index.type'
import { fastAssignmentValue } from '@/utils/objectTool'
import type { FormInstance } from 'element-plus'
import UploadImage from '@/components/UploadImage/index.vue'

const loading = ref(false)
const cropperEnable = ref(false)
const formRef = ref<FormInstance>()
const formData = reactive<TenantInfo>({
  id: '',
  account: '',
  name: '',
  telephone: '',
  fax: '',
  contacts: '',
  description: '',
  logo: '',
  type: '',
  adminUserId: '',
  adminUserAccount: '',
  adminUserRelName: '',
  enabled: 0,
  createStamp: 0,
  updateStamp: 0
})
const formRules = reactive({
  name: [{ required: true, message: '请输入企业名称', trigger: 'blur' }]
})
let originalFormData = ''
const initData = async (): Promise<void> => {
  try {
    loading.value = true
    await getTenantInfo()
  } catch (error) {
    console.error('await:', error)
  } finally {
    loading.value = false
  }
}
const getTenantInfo = async (): Promise<TenantInfo> => {
  const { data } = await tenantGet()
  originalFormData = JSON.stringify(data)
  fastAssignmentValue(formData, data)
  return data
}
const editEnable = ref<boolean>(false)
const clickToModify = (): void => {
  editEnable.value = true
}
const handleCancel = (): void => {
  const original: TenantInfo = JSON.parse(originalFormData)
  fastAssignmentValue(formData, original)
  editEnable.value = false
}
const handleConfirm = async (): Promise<void> => {
  try {
    if (!formRef.value) return
    await formRef.value.validate()
    loading.value = true
    await tenantUpdate({
      account: formData.account,
      name: formData.name,
      telephone: formData.telephone,
      fax: formData.fax,
      contacts: formData.contacts,
      description: formData.description,
      type: formData.type,
      logo: formData.logo
    })
    await getTenantInfo()
    editEnable.value = false
    $Notify({
      title: '消息',
      message: '操作成功',
      type: 'success'
    })
  } catch (error) {
    console.error('await:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  initData()
})
</script>

<style scoped lang="scss"></style>
