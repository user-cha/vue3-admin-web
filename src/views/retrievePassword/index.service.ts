/*
 * @Autor: wu
 * @Date: 2022-03-15 11:24:19
 * @Description: 找回密码
 */

import $HTTP from '@/library/service'
import type { RetrievePwdForm, SmsForm } from './index.type'

/** 找回密码 */
export function ssoReset(params: RetrievePwdForm) {
  return $HTTP.POST<RetrievePwdForm>('/sso/reset', params)
}

/** 发送验证码 */
export function sendSms(params: SmsForm) {
  return $HTTP.GET<SmsForm>('/framework/ali/send/sms', params)
}
