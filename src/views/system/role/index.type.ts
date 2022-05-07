/*
 * @Autor: ll
 * @Date: 2022-04-22 09:36:10
 * @Description: 类型声明
 */

export interface RoleListParams {
  name: string
}

export interface RoleListRes {
  id: string
  name: string
  description: string
  sort: number
  enabled: boolean
  createStamp: number
  updateStamp: number
  selected: boolean
}

export interface RoleEnableParams {
  ids: string
  enable: boolean
}

export interface RoleGetParams {
  id: string
}

export interface RoleForm {
  id?: string
  name: string
  description: string
}

export interface RolePermissionTreeParams {
  roleId: string
}

export interface RolePermissionTreeRes {
  id: string
  parentId: string
  children: RolePermissionTreeRes[]
  path: string
  name: string
  redirectName: string
  highlightName: string
  component: string
  hidden: boolean
  icon: string
  menu: boolean
  selected: boolean
}

export interface RolePermissionTreeSetupParams {
  roleId: string
  permissionIds: string
}
