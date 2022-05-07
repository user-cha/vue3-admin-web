/*
 * @Autor: wu
 * @Date: 2022-04-22 09:35:37
 * @Description: 角色管理
 */

import $HTTP from '@/library/service'
import type {
  RoleListParams,
  RoleListRes,
  RoleEnableParams,
  RoleGetParams,
  RoleForm,
  RolePermissionTreeParams,
  RolePermissionTreeRes,
  RolePermissionTreeSetupParams
} from './index.type'
import type { DeleteParams } from '@/service/common.type'

/** 角色列表 */
export function roleList(params: RoleListParams) {
  return $HTTP.GET<RoleListParams, RoleListRes[]>('/sso/role/list', params)
}

/** 角色删除 */
export function roleDelete(params: DeleteParams) {
  return $HTTP.DELETE<DeleteParams>('/sso/role/delete', params)
}

/** 角色启用禁用 */
export function roleEnable(params: RoleEnableParams) {
  return $HTTP.PUT<RoleEnableParams>('/sso/role/enable', params)
}

/** 角色查询 */
export function roleGet(params: RoleGetParams) {
  return $HTTP.GET<RoleGetParams, RoleListRes>('/sso/role/get', params)
}

/** 角色新增 */
export function roleAdd(params: RoleForm) {
  return $HTTP.POST<RoleForm>('/sso/role/add', params)
}

/** 角色编辑 */
export function roleUpdate(params: RoleForm) {
  return $HTTP.POST<RoleForm>('/sso/role/update', params)
}

/** 查询权限 */
export function permissionTree(params: RolePermissionTreeParams) {
  return $HTTP.GET<RolePermissionTreeParams, RolePermissionTreeRes[]>('/sso/permission/tree', params)
}

/** 设置权限 */
export function permissionSetup(params: RolePermissionTreeSetupParams) {
  return $HTTP.PUT<RolePermissionTreeSetupParams>('/sso/permission/setup', params)
}
