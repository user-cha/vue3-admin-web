<!--
 * @Autor: ll
 * @Date: 2022-03-24 16:39:48
 * @Description: 个人信息
-->

<route>
{
  name: "systemPersonalInfo",
  meta: {
    icon: 'system-personalInfo',
    title: "个人信息",
    sort: 1
  }
}
</route>

<template>
  <div class="app-container personal-info" :loading="loading" v-if="userInfo">
    <div class="section">
      <div class="avatar" @click="handleDialog('avatarDialog')">
        <el-image v-if="userInfo.avatar === '1' || userInfo.avatar === ''" src="/src/assets/images/layouts/avatar-1.jpg" class="img" />
        <el-image v-else-if="userInfo.avatar === '2'" src="/src/assets/images/layouts/avatar-2.jpg" class="img" />
        <el-image v-else :src="userInfo.avatar" class="img" />
        <p>
          <span>修改头像</span>
        </p>
      </div>
      <div class="intro">
        <p>登录账号: {{ userInfo.account || '--' }}</p>
        <p>上次登录时间: {{ dateTimeStr(userInfo.previousStamp) || '--' }}</p>
        <p>上次登录IP: {{ userInfo.previousIp || '--' }}</p>
      </div>
    </div>
    <!-- section -->
    <div class="section-item">
      <div class="text">
        <span>登录账号</span>
        <p>您可以修改登录账号，便于记忆。系统中账号唯一。</p>
      </div>
      <div class="setting">
        <div class="app-space">
          <el-tag v-if="!userInfo.cellphone" type="warning">请先绑定手机号</el-tag>
          <el-button type="primary" :disabled="!userInfo.cellphone" @click="handleDialog('accountDialog')">修改</el-button>
        </div>
      </div>
    </div>
    <div class="section-item">
      <div class="text">
        <span>登录密码</span>
        <p>安全性高的密码可以使账号更安全。建议您定期更换密码, 设置一个包含字母,符号或数字中至少两项且长度超过6位的密码</p>
      </div>
      <div class="setting">
        <el-button type="primary" @click="handleDialog('passwordDialog')">修改</el-button>
      </div>
    </div>
    <div class="section-item">
      <div class="text">
        <span>绑定手机号</span>
        <p v-if="userInfo.cellphone">
          您已绑定了手机
          <span style="color: #429bf4">
            {{ filterPhone(userInfo.cellphone) }}
          </span>
          【您的手机为安全手机，可以找回密码，但不能用于登录】
        </p>
        <p v-else>未绑定手机号</p>
      </div>
      <div class="setting">
        <div v-if="userInfo.cellphone" class="app-space">
          <el-tag color="success">已绑定</el-tag>
          <el-button type="primary" @click="handleDialog('cellphoneDialog')">修改</el-button>
        </div>
        <div v-else class="app-space">
          <el-tag color="warning">未绑定</el-tag>
          <el-button type="primary" @click="handleDialog('cellphoneDialog')">绑定</el-button>
        </div>
      </div>
    </div>
    <!-- 修改头像 -->
    <avatar-modify v-model="dialogAll.avatarDialog" :user-info="userInfo" :handle-update-info="stroe.setUserInfo" />
    <!-- 修改账号 -->
    <account-modify v-model="dialogAll.accountDialog" :user-info="userInfo" :handle-update-info="stroe.setUserInfo" />
    <!-- 修改密码 -->
    <password-modify v-model="dialogAll.passwordDialog" />
    <!-- 修改手机号 -->
    <bind-cellphone v-model="dialogAll.cellphoneDialog" :handle-update-info="stroe.setUserInfo" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { dateTimeStr } from '@/utils/dateFormat'
import { storeToRefs } from 'pinia'
import PiniaStroe from '@/library/pinia'
import AvatarModify from './components/AvatarModify.vue'
import AccountModify from './components/AccountModify.vue'
import PasswordModify from './components/PasswordModify.vue'
import BindCellphone from './components/BindCellphone.vue'

const loading = ref(false)
const stroe = PiniaStroe()
// 获取用户信息
const { userInfo } = storeToRefs(stroe)

const dialogAll = reactive({
  avatarDialog: false,
  accountDialog: false,
  passwordDialog: false,
  cellphoneDialog: false
})

const handleDialog = (key: string): void => {
  dialogAll[key] = true
}

const filterPhone = (cellphone: string): string => {
  return cellphone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}
</script>

<style lang="scss" scoped>
.personal-info {
  color: #484848;
  .section {
    display: flex;
    padding: 0 26px 20px 26px;
    border-bottom: 1px dashed #bbb;

    .avatar {
      text-align: center;
      cursor: pointer;

      .img {
        width: 116px;
        height: 116px;
        margin: 0;
        padding: 0;
        display: block;
        border-radius: 50%;
        object-fit: cover;
      }
      p {
        color: #428df2;
        font-size: 14px;
        margin-top: 10px;

        span {
          cursor: pointer;
        }
      }
    }
    .intro {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-size: 14px;
      padding-left: 40px;

      p {
        padding: 0;
        margin: 8px 0;
      }
    }
  }
}
.section-item {
  padding: 30px 40px 30px 20px;
  display: flex;
  align-items: center;
  border-bottom: 1px dashed #bbb;

  .text {
    flex: 1;
    display: flex;
    line-height: 25px;

    span {
      font-size: 16px;
      width: 150px;
    }
    p {
      font-size: 14px;
      padding: 0;
      margin: 0;
      flex: 1;
    }
  }
  .setting {
    width: 180px;
    line-height: 32px;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .ant-tag {
      margin-right: 30px;
    }
  }
}
i.el-icon-circle-check {
  color: #259b24;
  margin-right: 4px;
  font-size: 20px;
  position: relative;
  top: 2px;
}
i.el-icon-warning {
  color: #ff9800;
  margin-right: 4px;
  font-size: 20px;
  position: relative;
  top: 2px;
}
</style>
