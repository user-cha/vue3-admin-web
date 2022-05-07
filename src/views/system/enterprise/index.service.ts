/*
 * @Autor: wu
 * @Date: 2022-04-12 15:02:44
 * @Description: 企业信息
 */

import $HTTP from '@/library/service'
import { TenantInfo, TenantParams } from './index.type'

/** 获取企业信息 */
export function tenantGet() {
  return $HTTP.GET<null, TenantInfo>('/sso/tenant/get')
}

/** 修改企业信息 */
export function tenantUpdate(params: TenantParams) {
  return $HTTP.PUT<TenantParams>('/sso/tenant/update', params)
}
