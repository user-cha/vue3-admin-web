/*
 * @Autor: wu
 * @Date: 2022-04-27 13:50:05
 * @Description: 类型声明
 */

import type { PaginationCondition } from '@/service/common.type'

export interface AccountPageParams extends PaginationCondition {
  nameLike: string
}

export interface AccountPageCondition {
  nameLike: string
}

type Roles = {
  id: string
  name: string
}

export interface AccountPageRes {
  id: string
  account: string
  avatar: string
  cellphone: string
  email: string
  description: string
  realName: string
  gender: -1 | 0 | 1
  previousIp: string
  previousStamp: number
  createStamp: number
  updateStamp: number
  enabled: boolean
  roles: Roles[]
}

export interface AccountEnableParams {
  ids: string
  enable: boolean
}

export interface AccountGetParams {
  id: string
}

export interface AccountInstance {
  account: string
  password: string
  cellphone: string
  email: string
  realName: string
  gender: -1 | 0 | 1
  description: string
}

export interface AccountForm extends AccountInstance {
  id: string
  newPassword: string
  roleIds: string[]
}

export interface AccountAddParams extends AccountInstance {
  roleIds: string
}

export interface AccountEditParams extends AccountInstance {
  id: string
  roleIds: string
}

export interface AccountRoleChooser {
  id: string
  name: string
}
