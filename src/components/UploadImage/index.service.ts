/*
 * @Autor: wu
 * @Date: 2022-03-28 16:16:48
 * @Description: 图片上传
 */

import $HTTP from '@/library/service'
import type { AliSignaTureRes } from './index.type'

/** 阿里云oss签名 */
export function aliSignature() {
  return $HTTP.GET<null, AliSignaTureRes>('/framework/ali/signature')
}
