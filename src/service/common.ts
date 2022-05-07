/*
 * @Autor: ll
 * @Date: 2022-04-01 18:28:41
 * @Description: 公共接口
 */

import $HTTP from '@/library/service'
import type { UserInfo, SmsParams } from './common.type'

/** 用户信息 */
export function ssoUserInfo() {
  return $HTTP.GET<null, UserInfo>('/sso/user/info')
}

/** 发送验证码 */
export function sendSms(params: SmsParams) {
  return $HTTP.GET<SmsParams>('/framework/ali/send/sms', params)
}
