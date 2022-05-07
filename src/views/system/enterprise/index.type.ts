/*
 * @Autor: wu
 * @Date: 2022-04-12 14:46:12
 * @Description: 类型声明
 */

export interface TenantInfo {
  id: string
  account: string
  name: string
  telephone: string
  fax: string
  contacts: string
  description: string
  logo: string
  type: string
  adminUserId: string
  adminUserAccount: string
  adminUserRelName: string
  enabled: 0 | 1 // '是否启用[1:启用, 0:停用]'
  createStamp: number
  updateStamp: number
}

export interface TenantParams {
  account: string
  name: string
  telephone: string
  fax: string
  contacts: string
  description: string
  type: string
  logo: string
}
