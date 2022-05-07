<!--
 * @Autor: wu
 * @Date: 2022-03-24 16:19:52
 * @Description: 用户信息
-->
<template>
  <div class="user-info" v-if="userInfo" :class="{ 'user-info-hover': popoverVisible }">
    <el-popover placement="bottom-start" title="个人信息" :width="300" trigger="hover" ref="popoverRef">
      <template #reference>
        <div class="avatar">
          <div class="img">
            <el-image v-if="isCusstomizeAvatar" :src="userInfo.avatar" />
            <template v-else>
              <el-image v-if="userInfo.avatar === '2'" src="/src/assets/images/layouts/avatar-2.jpg" />
              <el-image v-else src="/src/assets/images/layouts/avatar-1.jpg" />
            </template>
          </div>
          <el-icon><arrow-down /></el-icon>
        </div>
      </template>
      <div class="about">
        <!-- 头像 -->
        <div class="avatar">
          <!-- 1 / 2 为系统默认头像 -->
          <el-image v-if="isCusstomizeAvatar" :src="userInfo.avatar" />
          <template v-else>
            <img v-if="userInfo.avatar === '2'" src="/src/assets/images/layouts/avatar-2.jpg" alt="avatar" />
            <img v-else src="/src/assets/images/layouts/avatar-1.jpg" alt="avatar" />
          </template>
        </div>
        <!-- 账号信息 -->
        <div class="account">
          <!-- 当前账号 -->
          <div class="row">
            <div class="label">当前账号:</div>
            <div class="value">{{ userInfo.account }}</div>
          </div>
          <!-- 角色权限 -->
          <div class="row">
            <div class="label">角色权限:</div>
            <div class="value">
              {{ userInfo.roleNames.join(' / ') }}
            </div>
          </div>
          <!-- 真实姓名 -->
          <div class="row">
            <div class="label">真实姓名:</div>
            <div class="value">{{ userInfo.realName || '--' }}</div>
          </div>
        </div>
      </div>
      <!-- 其他信息 -->
      <div class="other">
        <div class="row">
          <div class="label">登陆时间:</div>
          <div class="value">
            {{ dateTimeStr(userInfo.currentStamp) }}
          </div>
        </div>
        <div class="row">
          <div class="label">IP地址:</div>
          <div class="value">{{ userInfo.currentIp }}</div>
        </div>
        <div class="row">
          <div class="label">上次登陆时间:</div>
          <div class="value">
            {{ dateTimeStr(userInfo.previousStamp) }}
          </div>
        </div>
        <div class="row">
          <div class="label">上次IP地址:</div>
          <div class="value">{{ userInfo.previousIp || '--' }}</div>
        </div>
      </div>
      <!-- 按钮功能 -->
      <div class="button-group">
        <el-button type="primary" @click="handleJump()">个人中心</el-button>
        <el-button @click="handleSignOut()">退出登陆</el-button>
      </div>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import AppConfig from '@/library/config'
import Cookies from 'js-cookie'
import PiniaStore from '@/library/pinia'
import { storeToRefs } from 'pinia'
import { dateTimeStr } from '@/utils/dateFormat'
import { ElPopover } from 'element-plus'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const store = PiniaStore()
const { userInfo } = storeToRefs(store)
const router = useRouter()

const handleSignOut = (): void => {
  Cookies.remove(AppConfig.tokenName)
  location.reload()
}

const handleJump = (): void => {
  router.push({
    name: 'systemPersonalInfo'
  })
}

/** 个人中心 */
const popoverRef = ref<typeof ElPopover | null>(null)
const popoverVisible = computed(() => {
  return popoverRef.value?.tooltipRef.open
})
/** 判断是否是用户自定义头像 */
const isCusstomizeAvatar = computed((): boolean => {
  if (userInfo.value?.avatar) {
    return userInfo.value.avatar !== '1' && userInfo.value.avatar !== '2'
  } else {
    return false
  }
})
</script>

<style scoped lang="scss">
.user-info {
  .avatar {
    display: flex;
    padding: 5px 10px;
    align-items: center;
    cursor: pointer;
    transition: ease-in 0.3s;
    font-size: 14px;

    .img {
      width: 40px;
      height: 40px;
      border-radius: 2px;
      margin-right: 5px;
      padding: 2px;
      border: 1px solid #e1e1e1;
      overflow: hidden;
    }
    .el-image {
      width: 100%;
      height: 100%;
    }
    .el-icon {
      transition: all 0.3s;
    }
  }
  &.user-info-hover {
    .el-icon {
      transform: rotate(-180deg);
    }
  }
}
.about {
  display: flex;
  margin-bottom: 5px;

  .avatar {
    width: 80px;
    height: 80px;
    margin-right: 15px;
    border-radius: 4px;
    border: 1px solid #e1e1e1;
    padding: 2px;
    overflow: hidden;

    .ant-image,
    img {
      width: 100%;
      height: 100%;
    }
  }
  .account {
    flex: 1;
  }
}
// 公共的row样式
.row {
  font-size: 13px;
  line-height: 1.2em;
  display: flex;
  flex-wrap: wrap;
  padding: 5px 0;

  .label {
    flex-shrink: 0;
    font-weight: 500;
    margin-right: 5px;
  }
  .value {
    flex: 1;
    word-break: break-all;
    text-align: right;
  }
}
.button-group {
  display: flex;
  margin-top: 5px;

  .el-button {
    flex: 1;
  }
}
</style>
