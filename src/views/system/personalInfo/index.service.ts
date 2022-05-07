/*
 * @Autor: wu
 * @Date: 2022-03-28 11:56:18
 * @Description: 用户信息
 */

import $HTTP from '@/library/service'
import type { AvatarParams, AccountParams, PasswordParams, BindCellphoneForm } from './index.type'

/** 设置头像 */
export function setAvatar(params: AvatarParams) {
  return $HTTP.PUT<AvatarParams>('/sso/user/set/avatar', params)
}

/** 账号修改 */
export function setAccount(params: AccountParams) {
  return $HTTP.PUT<AccountParams>('/sso/user/set/account', params)
}

/** 密码修改 */
export function setPassword(params: PasswordParams) {
  return $HTTP.PUT<PasswordParams>('/sso/user/set/password', params)
}

/** 绑定手机号 */
export function bindCellphone(params: BindCellphoneForm) {
  return $HTTP.PUT<BindCellphoneForm>('/sso/user/cellphone/bind', params)
}
