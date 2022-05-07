<!--
 * @Autor: wu
 * @Date: 2022-03-10 15:28:19
 * @Description: 登录
-->
<route>
{
  name: "login",
  meta: {
    title: "登录"
  }
}
</route>

<template>
  <div class="login">
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
      <div class="background"></div>
      <!-- 登录部分 -->
      <div class="logo-form">
        <div class="welcome">
          <span class="cn">欢迎登陆</span>
          <span class="en">Welcome to login!</span>
        </div>
        <!-- 登录表单 -->
        <el-form :model="formData" :rules="formRules" ref="formRef" @submit.prevent="handleSubmit()">
          <div class="title">vue3 + element plus</div>
          <div class="brief">用户登录</div>
          <!-- 账号 -->
          <el-form-item prop="account">
            <el-input
              v-model.trim="formData.account"
              type="text"
              placeholder="请输入账号"
              :maxlength="11"
              prefix-icon="user"
              autocomplete="new-password"
            />
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input
              v-model.trim="formData.password"
              type="password"
              placeholder="请输入密码"
              :maxlength="18"
              prefix-icon="lock"
              show-password
              autocomplete="new-password"
            />
          </el-form-item>
          <!-- 免登录 -->
          <el-form-item prop="free" class="free">
            <el-checkbox v-model="formData.free">勾选7天免登录</el-checkbox>
            <router-link :to="{ name: 'retrievePassword' }" class="forget">忘记密码?</router-link>
          </el-form-item>
          <!-- 验证码 -->
          <el-form-item v-if="geetestEnable" prop="verification">
            <div id="captcha">
              <div v-if="captchaStatus === 0" class="loading-animation">
                <div class="block"></div>
                <div class="block"></div>
                <div class="block"></div>
                <div class="block"></div>
                <div class="block"></div>
                <div class="intro">验证码加载中...</div>
              </div>
              <div v-else-if="captchaStatus === 2" class="error">
                <i class="a-icon-error"></i>
                <span>验证码加载失败</span>
              </div>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button class="submit-btn" type="primary" native-type="submit" :loading="loading">
              {{ loading ? '正在登录' : '登 陆' }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 登录部分 end -->
    </div>
    <!-- 主体部分 end -->
  </div>
</template>

<script setup lang="ts">
import Cookies from 'js-cookie'
import AppConfig from '@/library/config'
import PiniaStore from '@/library/pinia'
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ssoSecurityGee, ssoLogin } from './index.service'
import type { SsoLoginForm } from './index.type'
import type { FormInstance } from 'element-plus'
import './index.plugin.gt.js'

const router = useRouter()
const store = PiniaStore()
/**
 * 表单部分
 */
const loading = ref(false)
const formData = reactive<SsoLoginForm>({
  account: '',
  password: '',
  verification: '',
  free: false,
  geeTestChallenge: '',
  geeTestValidate: '',
  geeTestSecCode: '',
  gtServerStatus: 1
})
const formRules = reactive({
  account: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 2, max: 11, message: '请输入合法的账号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 18, message: '请输入合法的密码', trigger: 'blur' }
  ],
  verification: [{ required: true, message: '请先滑块验证', trigger: 'change' }]
})

/**
 * 表单提交
 */
const formRef = ref<FormInstance>()
const handleSubmit = async (): Promise<void> => {
  // 存储账号,方便快捷填充
  accountCookieSet()
  try {
    if (!formRef.value) return
    await formRef.value.validate()
    loading.value = true
    try {
      const { data } = await ssoLogin(formData)
      // 设置token
      Cookies.set(AppConfig.tokenName, data.token)
      // 初始化项目信息
      await store.initAppData()
      if (store.appMenus && store.appMenus.length > 0) {
        router.push({ name: store.appMenus[0].name })
        $Notify({
          title: '消息',
          message: '登录成功',
          type: 'success'
        })
      } else {
        $Notify({
          title: '消息',
          message: '未获取到菜单信息',
          type: 'error'
        })
        throw Error('未获取到菜单信息')
      }
    } catch (error) {
      formData.password = ''
      const captchaDom = document.querySelector('#captcha')
      captchaDom?.removeChild(captchaDom.childNodes[1])
      initGee()
      throw error
    }
  } catch (error) {
    console.error('await:', error)
  } finally {
    loading.value = false
  }
}

/**
 * 验证码部分
 */
const captchaStatus = ref(0)
const geetestEnable = ref(AppConfig.geetestEnable)
const initGee = async (): Promise<void> => {
  try {
    captchaStatus.value = 0
    const { data } = await ssoSecurityGee()
    window.initGeetest(
      {
        gt: data.gt,
        challenge: data.challenge,
        offline: !data.success,
        new_captcha: data.newCaptcha,
        product: 'float',
        width: '100%'
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (captcha: any): void => {
        captcha.appendTo('#captcha')
        captcha.onReady(() => {
          captchaStatus.value = 1
        })
        captcha.onSuccess(() => {
          const val = captcha.getValidate()
          // 给formData的极速验证赋值
          formData.verification = 'success'
          formData.geeTestChallenge = val.geetest_challenge
          formData.geeTestValidate = val.geetest_validate
          formData.geeTestSecCode = val.geetest_seccode
          formData.gtServerStatus = data.gtServerStatus
          // 移除极速验证的校验
          formRef.value?.clearValidate('verification')
        })
      }
    )
  } catch (error) {
    captchaStatus.value = 2
  }
}

/**
 * 账号快速填充
 */
const accountCookieSet = (): void => {
  Cookies.set('account', formData.account)
}
const acountCookieGet = (): void => {
  formData.account = Cookies.get('account') || ''
}

/** DOM渲染完毕 */
onMounted(() => {
  // 快速填充账号
  acountCookieGet()
  if (geetestEnable.value) {
    initGee()
  }
})
</script>

<style lang="scss" scoped>
.login {
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

    .background {
      width: 45%;
      min-width: 450px;
      height: 100%;
      background: url('@/assets/images/login/background.png') no-repeat center;
      background-size: contain;
      margin-right: 10vw;
      flex-shrink: 0;
    }
    .logo-form {
      max-width: 400px;
      min-width: 350px;
      flex: 1;
      flex-shrink: 0;
      margin-top: -56px;
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
        margin-top: 3vh;
        padding: 10%;
        box-shadow: 0px 0px 12px 4px #e5f2ff;

        .title {
          font-size: 20px;
          font-weight: bold;
          text-align: center;
          color: #3eadff;
          padding: 6% 0;
        }
        .brief {
          font-size: 16px;
          color: #484848;
          margin-bottom: 6px;
        }
        .el-form-item {
          .submit-btn {
            width: 100%;
          }
        }
        .free {
          margin: 0;
          line-height: 32px;

          :deep() {
            .el-form-item__content {
              justify-content: space-between;
            }
            .el-checkbox__label {
              font-size: 12px;
              font-weight: 500;
            }
            .forget {
              color: #828282;
              font-size: 12px;
            }
          }
        }
        #captcha {
          position: relative;
          background-image: linear-gradient(180deg, #ffffff 0%, #f3f3f3 100%);
          font-size: 14px;
          height: 44px;
          width: 100%;

          .geetest_holder.geetest_wind {
            min-width: initial;
          }
          .error {
            border-radius: 2px;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 44px;
            color: #666;
            border: 1px solid #ccc;

            i {
              margin-right: 5px;
              color: #f56c6c;
              font-size: 14px;
            }
          }
          .loading-animation {
            display: flex;
            height: 44px;
            justify-content: center;
            align-items: center;
            border: 1px solid #ccc;
            border-radius: 2px;
            color: #666;

            .block {
              width: 4px;
              height: 4px;
              background: #409eff;
              margin: 0 3px;
              animation: loading linear 1s infinite;
              transition: ease-in 0.3s;

              &:nth-child(1) {
                animation-delay: 0s;
              }
              &:nth-child(2) {
                animation-delay: 0.15s;
              }
              &:nth-child(3) {
                animation-delay: 0.3s;
              }
              &:nth-child(4) {
                animation-delay: 0.45s;
              }
              &:nth-child(5) {
                animation-delay: 0.6s;
              }
              @keyframes loading {
                0%,
                60%,
                100% {
                  transform: scale(1);
                }
                30% {
                  transform: scaleY(3);
                }
              }
            }
            .intro {
              padding-left: 5px;
            }
          }
        }
      }
    }
  }
}
@media screen and (max-width: 1050px) {
  .login {
    padding: 3vh 7vw 3vh 3vw;
  }
}
</style>
