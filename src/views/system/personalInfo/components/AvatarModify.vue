<!--
 * @Autor: ll
 * @Date: 2022-03-28 15:04:08
 * @Description: 修改头像
-->

<template>
  <div class="dialog">
    <el-dialog v-model="dialogVisible" title="修改头像" :close-on-click-modal="false" width="450px" @open="handleOpen()" @closed="handleClosed()">
      <el-tabs v-model="formData.activeName" stretch v-loading="loading">
        <el-tab-pane label="系统头像" name="first">
          <p>可使用系统头像选择一张图片作为头像</p>
          <div class="app-space system">
            <div class="part" @click="handleSelect('1')">
              <el-avatar src="/src/assets/images/layouts/avatar-1.jpg" />
              <el-icon v-show="formData.avatarType === '1' || formData.avatarType === ''">
                <circle-check-filled />
              </el-icon>
            </div>
            <div class="part" @click="handleSelect('2')">
              <el-avatar src="/src/assets/images/layouts/avatar-2.jpg" />
              <el-icon v-show="formData.avatarType === '2'">
                <circle-check-filled />
              </el-icon>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="自定义头像" name="second">
          <p>从电脑里挑选一张图片作为头像</p>
          <div class="customize">
            <upload-image v-model:single="formData.avatar" />
          </div>
          <div style="text-align: center">
            <el-checkbox v-model="cropperEnable" label="开启裁剪" />
          </div>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <span>
          <el-button @click="handleCancel()">取 消</el-button>
          <el-button type="primary" @click="handleConfirm()">确 认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import UploadImage from '@/components/UploadImage/index.vue'
import { reactive, ref, watch } from 'vue'
import type { UserInfo } from '@/service/common.type'
import { ElMessage } from 'element-plus'
import { setAvatar } from '../index.service'
import type { AvatarForm } from '../index.type'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  userInfo: {
    type: Object as () => UserInfo,
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
  setTimeout(() => {
    if (props.userInfo.avatar && props.userInfo.avatar !== '1' && props.userInfo.avatar !== '2') {
      formData.activeName = 'second'
      formData.avatar = props.userInfo.avatar
    } else {
      formData.activeName = 'first'
      formData.avatarType = props.userInfo.avatar
    }
  }, 0)
}
/** 关闭弹窗 */
const handleClosed = (): void => {
  formData.activeName = 'first'
  formData.avatar = ''
  formData.avatarType = ''
  emits('update:modelValue', false)
}
/** 点击取消 */
const handleCancel = (): void => {
  dialogVisible.value = false
}
/** 点击确认 */
const loading = ref(false)
const cropperEnable = ref(false)
const handleConfirm = async (): Promise<void> => {
  try {
    if (formData.activeName === 'second' && !formData.avatar) {
      ElMessage({
        message: '请上传头像!',
        type: 'warning'
      })
      return
    }
    const params = {
      avatar: ''
    }
    if (formData.activeName === 'first') {
      params.avatar = formData.avatarType
    } else {
      params.avatar = formData.avatar
    }
    loading.value = true
    await setAvatar(params)
    await props.handleUpdateInfo()
    await $Notify({
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
/** 表单 */
const formData = reactive<AvatarForm>({
  activeName: 'first',
  avatar: '',
  avatarType: ''
})
/** 选择头像 */
const handleSelect = (type: string): void => {
  formData.avatarType = type
}
</script>

<style scoped lang="scss">
.dialog {
  .system {
    width: 100%;
    justify-content: space-around;
    margin-top: 15px;

    .part {
      width: 120px;
      height: 120px;
      position: relative;
      cursor: pointer;

      .el-avatar {
        width: 100%;
        height: 100%;
      }
      .el-icon {
        position: absolute;
        top: 10px;
        right: 0;
        color: #259b24;
        background: #ffffff;
        font-size: 30px;
        border-radius: 50%;
      }
    }
  }
  .customize {
    padding-top: 15px;
    text-align: center;
  }
}
</style>
