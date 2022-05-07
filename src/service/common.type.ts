/*
 * @Autor: ll
 * @Date: 2022-04-01 18:28:46
 * @Description: 公共接口类型声明
 */

/** 用户信息 */
export interface UserInfo {
  id: string
  logo: string
  account: string
  avatar: string
  realName: string
  /** -1: 未知, 0: 女 1:男 */
  gender: -1 | 0 | 1
  cellphone: string
  email: string
  description: string
  previousIp: string
  previousStamp: number
  currentIp: string
  currentStamp: number
  roleIds: string[]
  roleNames: string[]
  menus: Menus[]
}

/** 菜单 */
export interface Menus {
  routeName: ''
  children: Menus[]
}

/** 发送短信 */
export interface SmsParams {
  /** 1: 注册, 2: 重置密码, 3: 登录, 4: 信息变更, 5: 身份验证, 7: 异地登陆 */
  type: 1 | 2 | 3 | 4 | 5 | 7
  /** 手机号码 */
  cellphone: number
}

/** 分页数据 */
export interface PaginationStructure<T> {
  pageNum: number
  pageSize: number
  totalCount: number
  totalPage: number
  list: T[]
}

/** 分页固定条件 */
export interface PaginationCondition {
  currentPage: number
  pageSize: number
  property: string
  mode: boolean
}

/** 常用新增/编辑类型 */
export type AddEditType = 'add' | 'edit'

/** 常用删除类型 */
export interface DeleteParams {
  ids: string
}

/** 常用下拉框类型 */
export interface SelectOptions {
  value: string
  label: string
}
