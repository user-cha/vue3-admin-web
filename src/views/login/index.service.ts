/*
 * @Autor: wu
 * @Date: 2022-03-14 17:30:44
 * @Description: 登录
 */

import $HTTP from '@/library/service'
import type { GeeRes, SsoLoginForm, SsoLoginRes } from './index.type'

/** 极速验证签名 */
export function ssoSecurityGee() {
  return $HTTP.GET<null, GeeRes>('/sso/security/gee')
}

/** SSO登录 */
export function ssoLogin(params: SsoLoginForm) {
  return $HTTP.POST<SsoLoginForm, SsoLoginRes>('/sso/login', params)
}
