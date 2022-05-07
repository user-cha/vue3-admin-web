/*
 * @Autor: wu
 * @Date: 2022-03-28 16:19:21
 * @Description: 类型声明
 */

/** 阿里云签名 */
export interface AliSignaTureRes {
  host: string
  policy: string
  accessKeyId: string
  signature: string
  finalExpireTimeMillis: number
  key: string
}

/** 上传签名需要的参数 */
export interface AliSignaTureForm {
  host: string
  policy: string
  OSSAccessKeyId: string
  signature: string
  finalExpireTimeMillis: number
  originalKey: string
  key: string
}

/** 图片宽高信息 */
export interface ImageInfo {
  width: number
  height: number
}

export interface TemporaryFileUrl {
  uid: number
  url: string
}
