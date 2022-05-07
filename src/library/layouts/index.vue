<!--
 * @Autor: ll
 * @Date: 2022-03-22 10:22:58
 * @Description: 品字布局容器
-->

<template>
  <el-container
    class="app-layout"
    :class="{
      'app-layout-dark': themeType === 'dark',
      'app-layout-light': themeType === 'light'
    }"
  >
    <!-- 头部 -->
    <el-header class="app-header">
      <!-- logo -->
      <div v-if="userInfo && userInfo.logo" class="logo">
        <!-- 图片logo 180*40 -->
        <el-image :src="userInfo.logo" />
      </div>
      <div v-else class="logo">
        <!-- 图片logo 180*40 -->
        <el-image v-if="themeType === 'dark'" src="/src/assets/images/layouts/dark-logo.png" />
        <el-image v-else src="/src/assets/images/layouts/light-logo.png" />
      </div>
      <!-- 菜单 -->
      <div class="menu">
        <el-menu
          mode="horizontal"
          :default-active="topMenuActive"
          :active-text-color="themeData[themeType].activeTextColor"
          :background-color="themeData[themeType].backgroundColor"
          :text-color="themeData[themeType].textColor"
          @select="handleMenuClick($event)"
        >
          <el-menu-item v-for="item in appMenus" :key="item.name" :index="forcedConversion(item)">
            <svg-icon v-if="item.meta?.icon" :name="item.meta.icon" />
            <template #title>{{ item.meta?.title }}</template>
          </el-menu-item>
        </el-menu>
      </div>
      <!-- 主题 -->
      <div class="theme">
        <el-tooltip effect="dark" content="切换主题" placement="bottom">
          <el-link :underline="false" @click="handleCutoverTheme()">
            <el-icon v-if="themeType === 'dark'"><sunny /></el-icon>
            <el-icon v-else><moon-night /></el-icon>
          </el-link>
        </el-tooltip>
      </div>
      <!-- 头像 / 个人信息 -->
      <user-info-vue />
    </el-header>
    <!-- 头部结束 -->
    <el-container>
      <!-- 左侧菜单 -->
      <el-aside :width="asideWidth + 'px'" class="app-left-menus">
        <el-scrollbar>
          <!-- 左侧菜单 -->
          <el-menu
            :collapse="isCollapse"
            :default-active="secondaryMenuActive"
            :active-text-color="themeData[themeType].activeTextColor"
            :background-color="themeData[themeType].backgroundColor"
            :text-color="themeData[themeType].textColor"
            @select="handleMenuClick($event)"
          >
            <menu-item v-for="item in childMenus" :key="item.name" :menu="item" />
          </el-menu>
        </el-scrollbar>
        <div class="toggle-sidebar" @click="handleCollapse()">
          <el-icon v-if="!isCollapse"><d-arrow-left /></el-icon>
          <el-icon v-else><d-arrow-right /></el-icon>
          <span>收合侧栏</span>
        </div>
      </el-aside>
      <!-- 右侧内容 -->
      <el-container>
        <!-- 面包屑 -->
        <el-header class="app-breadcrumb">
          <el-breadcrumb separator-icon="arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">
              <el-icon class="icon"><home-filled /></el-icon>
              <span>首页</span>
            </el-breadcrumb-item>
            <el-breadcrumb-item v-for="item in breadCrumbs" :key="item.name" :to="{ name: item.name }">
              <svg-icon class="icon" v-if="item.meta.icon" :name="item.meta.icon" />
              <span>{{ item.meta.title }}</span>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </el-header>
        <!-- 正文内容 -->
        <el-main>
          <router-view v-slot="{ Component }">
            <transition name="slide-fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter, RouteRecordRaw } from 'vue-router'
import UserInfoVue from './components/UserInfo.vue'
import MenuItem from './components/MenuItem.vue'
import PiniaStroe from '@/library/pinia'
import Cookies from 'js-cookie'

/** 菜单 */
const router = useRouter()
const route = useRoute()
const stroe = PiniaStroe()
// 获取菜单
const { appMenus, userInfo } = storeToRefs(stroe)
// 顶级高亮
const topMenuActive = computed((): string => {
  const routeName: string = <string>route.matched[0].name
  return routeName
})
// 二级高亮
const secondaryMenuActive = computed((): string => {
  const routeName: string = <string>(route.meta.highlightName || route.name)
  return routeName
})
// 转换route name
function forcedConversion(row: RouteRecordRaw): string {
  return <string>row.name
}
// 点击菜单
function handleMenuClick(name: string): void {
  router.push({ name })
}
// 设置左侧菜单的默认数据
const childMenus = ref<RouteRecordRaw[]>([])
watch(
  () => route.name,
  (): void => {
    const findData = appMenus.value?.find((item) => item.name === route.matched[0].name)
    if (findData) {
      childMenus.value = findData.children || []
    }
  },
  {
    immediate: true
  }
)

/** 切换主题 */
const themeType = ref<'dark' | 'light'>('light')
const themeVal = Cookies.get('theme')
if (themeVal === 'dark' || themeVal === 'light') {
  themeType.value = themeVal
}
const themeData = reactive({
  dark: {
    activeTextColor: '#ffd04b',
    backgroundColor: '#545c64',
    textColor: '#ffffff'
  },
  // 取默认值
  light: {
    activeTextColor: '',
    backgroundColor: '',
    textColor: ''
  }
})
function handleCutoverTheme(): void {
  if (themeType.value === 'dark') {
    themeType.value = 'light'
  } else {
    themeType.value = 'dark'
  }
  Cookies.set('theme', themeType.value)
}

/** 面包屑 */
const breadCrumbs = computed(() => {
  return route.matched
})

/** 菜单栏收缩 */
const asideWidth = ref(220)
const isCollapse = ref(false)
function handleCollapse(): void {
  isCollapse.value = !isCollapse.value
  asideWidth.value = isCollapse.value ? 64 : 220
}
</script>

<style scoped lang="scss">
.app-layout {
  width: 100vw;
  height: 100vh;
  min-width: 1000px;
  background: #f1f1f1;

  .app-header {
    display: flex;
    padding: 0;
    height: 50px;
    box-shadow: 0px 2px 3px 0px rgb(227 227 227 / 50%);
    transition: all 0.3s;

    .logo {
      width: 220px;
      height: 50px;

      .el-image {
        width: 100%;
        height: 100%;
      }
    }
    .menu {
      flex: 1;
      overflow: hidden;

      .el-menu {
        height: 50px;
        background: transparent;

        .el-menu-item {
          height: 50px;
          line-height: 50px;

          .app-svg-icon {
            margin-right: 8px;
          }
        }
        .is-active {
          background-color: var(--el-menu-hover-bg-color);
        }
      }
      .el-menu--horizontal {
        border-bottom: 0;
      }
    }
    .theme {
      display: flex;
      align-items: center;
      padding: 0 10px;

      .el-link {
        font-size: 22px;
      }
    }
  }
  .el-container {
    overflow: hidden;

    .app-left-menus {
      padding: 17px 0 0 0;
      transition: all 0.3s;
      display: flex;
      flex-direction: column;
      overflow: hidden;

      .el-menu {
        border-right: 0;
        background-color: transparent;

        :deep() {
          .el-menu-item {
            height: 46px;
            line-height: 46px;

            .app-svg-icon {
              margin-right: 5px;
              width: 24px;
              font-size: 14px;
            }
          }
          .el-menu-item.is-active {
            background-color: var(--el-menu-hover-bg-color);
          }
        }
      }
      .toggle-sidebar {
        width: 220px;
        height: 50px;
        line-height: 50px;
        border-top: 1px solid #f1f1f1;
        padding: 0 16px 0 22px;
        font-size: 14px;
        cursor: pointer;
        overflow: hidden;
        transition: all 0.3s;
        display: flex;
        align-items: center;

        .el-icon {
          width: 24px;
          margin-right: 5px;
        }
        span {
          flex: 1;
          text-align: center;
          padding-right: 6px;
        }
      }
    }
    .el-main {
      padding: 0 15px;
    }
    .app-breadcrumb {
      height: 50px;
      line-height: 1.4em;
      margin: 15px 15px 10px;
      box-shadow: 0px 2px 3px 0px rgb(227 227 227 / 50%);
      border-radius: 4px;
      overflow: hidden;
      display: flex;
      align-items: center;
      transition: all 0.3s;

      .el-breadcrumb__item {
        :deep(.el-breadcrumb__inner) {
          display: flex;
          align-items: center;
          font-weight: 400 !important;
        }
        .icon {
          margin-right: 4px;
        }
      }
    }
  }
}
</style>
