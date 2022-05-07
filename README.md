<!--
 * @Autor: ll
 * @Date: 2022-03-01 13:38:32
 * @Description: 项目描述文件
-->

# Vue 3 + Typescript + Vite

This template should help get you started developing with Vue 3 and Typescript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

## Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's `.vue` type support plugin by running `Volar: Switch TS Plugin on/off` from VSCode command palette.

## Router meta 属性的补充信息

| 属性          | 类型                | 说明                                 |
| ------------- | ------------------- | ------------------------------------ |
| icon          | string / undefined  | 显示的菜单 SVG 图标                  |
| title         | string              | 显示的菜单名称                       |
| hidden        | boolean / undefined | 是否隐藏当前页面(不在菜单栏显示)     |
| highlightName | string / undefined  | 当显示当前页面时, 需要高亮的左侧菜单 |
