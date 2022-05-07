/*
 * @Autor: ll
 * @Date: 2022-03-01 13:38:32
 * @Description: 主体文件
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import Router from '@/library/router'
import '@/library/router/guards'
import SvgIcon from '@/components/SvgIcon/index.vue'
import ElementPlus, { ElNotification, ElInput, ElSelect } from 'element-plus'
import ZhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementIcons from '@element-plus/icons-vue'
import 'normalize.css'
import 'element-plus/dist/index.css'
import '@/library/styles/app.scss'
import '@/library/styles/theme.scss'
import 'virtual:svg-icons-register'

/** 全局配置Element plus 属性 */
window.$Notify = ElNotification
ElInput.props.clearable.default = true
ElSelect.props.clearable.default = true

const app = createApp(App)

app.component('SvgIcon', SvgIcon)
app
  .use(Router)
  .use(createPinia())
  .use(ElementPlus, {
    locale: ZhCn
  })
  .mount('#app')

Object.keys(ElementIcons).forEach((key) => {
  app.component(key, ElementIcons[key as keyof typeof ElementIcons])
})
