/*
 * @Autor: wu
 * @Date: 2022-04-27 13:48:57
 * @Description: 账号管理
 */

import $HTTP from '@/library/service'
import type {
  AccountPageParams,
  AccountPageRes,
  AccountEnableParams,
  AccountGetParams,
  AccountAddParams,
  AccountEditParams,
  AccountRoleChooser
} from './index.type'
import type { DeleteParams, PaginationStructure } from '@/service/common.type'

/** 账号分页 */
export function accountPage(params: AccountPageParams) {
  return $HTTP.POST<AccountPageParams, PaginationStructure<AccountPageRes>>('/sso/account/page', params)
}

/** 账号删除 */
export function accountDelete(params: DeleteParams) {
  return $HTTP.DELETE('/sso/account/delete', params)
}

/** 账号禁用 */
export function accountEnable(params: AccountEnableParams) {
  return $HTTP.PUT('/sso/account/enable', params)
}

/** 账号查询 */
export function accountGet(params: AccountGetParams) {
  return $HTTP.GET<AccountGetParams, AccountPageRes>('/sso/account/get', params)
}

/** 账号新增 */
export function accountAdd(params: AccountAddParams) {
  return $HTTP.POST('/sso/account/add', params)
}

/** 账号编辑 */
export function accountUpdate(params: AccountEditParams) {
  return $HTTP.PUT('/sso/account/update', params)
}

/** 账号操作时，获取角色列表 */
export function accountRoleChooser() {
  return $HTTP.GET<null, AccountRoleChooser[]>('/sso/role/chooser')
}
