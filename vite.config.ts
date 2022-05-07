/*
 * @Autor: ll
 * @Date: 2022-03-01 13:38:32
 * @Description: vite 配置文件
 */

import { ConfigEnv, defineConfig, UserConfigExport } from 'vite'
import { resolve } from 'path'
import { viteMockServe } from 'vite-plugin-mock'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import AppConfig from './src/library/config'

// https://vitejs.dev/config/
export default ({ command }: ConfigEnv): UserConfigExport => {
  return defineConfig({
    plugins: [
      Vue(),
      Pages({
        dirs: 'src/views',
        exclude: ['**/components/*.vue', '**/*.ts', '**/*.js']
      }),
      viteMockServe({
        mockPath: 'mock',
        localEnabled: command === 'serve' && AppConfig.mockEnabled
      }),
      createSvgIconsPlugin({
        iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]'
      })
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    // 为开发服务器配置自定义代理规则
    server: {
      port: 3000,
      proxy: {
        ['/' + AppConfig.backendProjectName]: {
          target: AppConfig.baseUrl, // 本地需要代理的地址
          changeOrigin: true // 是否需要跨域
        }
      }
    }
  })
}
