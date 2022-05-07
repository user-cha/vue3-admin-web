<!--
 * @Autor: ll
 * @Date: 2022-03-14 17:13:55
 * @Description: 找回密码
-->

<route>
{
  name: "retrievePassword",
  meta: {
    title: "找回密码"
  }
}
</route>

<template>
  <div class="forget-password">
    <!-- logo部分 -->
    <div class="header">
      <div class="cn">
        <el-image src="/src/assets/images/login/logo.png" class="logo" />
        <span>后台管理系统</span>
      </div>
      <div class="en">Vue3 background management system</div>
    </div>
    <!-- logo部分 end -->
    <!-- 主体部分 -->
    <div class="main">
      <div class="bg"></div>
      <!-- 登录部分 -->
      <div class="logo-form">
        <div class="welcome">
          <div class="back">
            <el-button type="text" icon="arrow-left" @click="handleBack()">返回</el-button>
          </div>
          <!-- 登录表单 -->
          <el-form ref="formRef" :model="formData" :rules="formRules" @submit.prevent="handleSubmit()">
            <div class="brief">忘记密码</div>
            <el-form-item prop="cellphone">
              <el-input
                v-model.trim="formData.cellphone"
                type="text"
                placeholder="请输入绑定的手机号"
                :maxlength="11"
                prefix-icon="iphone"
                autocomplete="new-password"
              />
            </el-form-item>
            <!-- 验证码 -->
            <div class="form-item">
              <el-form-item prop="smsCode" class="flex">
                <el-input
                  v-model.trim="formData.smsCode"
                  type="text"
                  placeholder="请输入验证码"
                  :maxlength="6"
                  prefix-icon="key"
                  autocomplete="new-password"
                />
              </el-form-item>
              <el-button type="primary" @click="handleSendCode()" :loading="codeLoading" :disabled="codeNum > 0">
                {{ codeNum > 0 ? `倒计时${codeNum}秒` : '发送验证码' }}
              </el-button>
            </div>
            <!-- 密码 -->
            <el-form-item prop="password">
              <el-input
                v-model.trim="formData.password"
                type="password"
                placeholder="设置新密码: 6~18位字母数字组合"
                :maxlength="18"
                prefix-icon="lock"
                autocomplete="new-password"
              />
            </el-form-item>
            <!-- 再次输入密码 -->
            <el-form-item prop="repeatPwd">
              <el-input
                v-model:value.trim="formData.repeatPwd"
                type="password"
                placeholder="再次输入新密码"
                :maxlength="18"
                prefix-icon="lock"
                autocomplete="new-password"
              />
            </el-form-item>
            <el-form-item>
              <el-button class="submit-btn" type="primary" native-type="submit" :loading="loading">
                {{ loading ? '正在提交' : '提 交' }}
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!-- 登录部分 end -->
    </div>
    <!-- 主体部分 end -->
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ssoReset, sendSms } from './index.service'
import type { RetrievePwdForm } from './index.type'
import type { FormInstance } from 'element-plus'

const router = useRouter()

/**
 * 表单部分
 */
const formData = reactive<RetrievePwdForm>({
  cellphone: '',
  smsCode: '',
  password: '',
  repeatPwd: ''
})
const formRules = reactive({
  cellphone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      pattern: /^1[34578]\d{9}$/,
      message: '请输入合法的手机号',
      trigger: 'blur'
    }
  ],
  smsCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 18, message: '请输入合法的密码', trigger: 'blur' }
  ],
  repeatPwd: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      validator: (_rule: any, value: string, callback: any) => {
        if (value !== formData.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

/**
 * 提交表单
 */
const formRef = ref<FormInstance>()
const loading = ref(false)
const handleSubmit = async (): Promise<void> => {
  try {
    if (!formRef.value) return
    loading.value = true
    await formRef.value.validate()
    await ssoReset(formData)
    formRef.value.resetFields()
    $Notify({
      title: '消息',
      message: '找回成功',
      type: 'success'
    })
  } catch (error) {
    console.error('await:', error)
  } finally {
    loading.value = false
  }
}

/** 返回上一页 */
const handleBack = (): void => {
  router.go(-1)
}

/**
 * 发送验证码
 */
const codeLoading = ref(false)
const codeNum = ref(0)
let codeFun: NodeJS.Timer
const handleSendCode = async (): Promise<void> => {
  try {
    codeLoading.value = true
    await formRef.value?.validateField('cellphone')
    await sendSms({ type: 2, cellphone: Number(formData.cellphone) })
    $Notify({
      title: '消息',
      message: '发送成功',
      type: 'success'
    })
    codeNum.value = 120
    codeFun = setInterval(() => {
      if (codeNum.value === 0) {
        clearInterval(codeFun)
      }
      codeNum.value--
    }, 1000)
  } catch (error) {
    console.error('await:', error)
  } finally {
    codeLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.forget-password {
  min-width: 992px;
  min-height: 558px;
  height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 5vh 7vw;

  .header {
    font-size: 22px;
    color: #666666;

    .cn {
      display: flex;
      align-items: center;
    }
    .en {
      font-size: 14px;
      color: #949494;
      letter-spacing: 1px;
      line-height: 20px;
    }
    .logo {
      margin-right: 10px;
      display: flex;
      align-items: center;
    }
  }
  .main {
    display: flex;
    flex: 1;
    align-items: center;

    .bg {
      width: 45%;
      min-width: 450px;
      height: 100%;
      background: url('@/assets/images/retrievePassword/bg.png') no-repeat center;
      background-size: contain;
      margin-right: 10vw;
      flex-shrink: 0;
    }
    .logo-form {
      max-width: 400px;
      min-width: 350px;
      flex: 1;
      flex-shrink: 0;
    }
    .logo-form {
      .welcome {
        .cn {
          font-size: 24px;
          color: #676767;
          line-height: 32px;
          display: block;
        }
        .en {
          font-size: 18px;
          line-height: 24px;
          color: #a4a4a4;
          letter-spacing: 2px;
          display: block;
        }
      }
      .el-form {
        margin-top: 15px;
        padding: 10%;
        box-shadow: 0px 0px 12px 4px #e5f2ff;

        .brief {
          font-size: 16px;
          color: #484848;
          margin-bottom: 15px;
        }
        .submit-btn {
          width: 100%;
          height: 36px;
          font-size: 14px;
        }
        .form-item {
          display: flex;
          justify-content: space-between;

          .el-form-item {
            flex: 1;
            margin-right: 15px;
          }
        }
      }
    }
  }
}
</style>
