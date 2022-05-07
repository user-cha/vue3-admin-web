/*
 * @Autor: wu
 * @Date: 2022-03-28 16:01:02
 * @Description: 类型声明
 */

export interface AvatarForm {
  activeName: 'first' | 'second'
  avatar: string
  avatarType: string
}

export interface AvatarParams {
  avatar: string
}

export interface AccountForm {
  account: string
  newAccount: string
  cellphone: string
  code: string
}

export interface AccountParams {
  account: string
  smsCode: string
}

export interface PasswordForm {
  password: string
  newPassword: string
  rptPassword: string
}

export interface PasswordParams {
  oldPwd: string
  newPwd: string
}

export interface BindCellphoneForm {
  cellphone: string
  smsCode: string
}
