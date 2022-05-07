/*
 * @Autor: wu
 * @Date: 2022-03-24 15:35:24
 * @Description: 日期格式转换
 */

interface DateTimeObject {
  /** 年份 */
  year: number
  /** 月份 1-12月 */
  month: number
  /** 日 */
  day: number
  /** 小时 */
  hour: number
  /** 分钟 */
  minute: number
  /** 秒 */
  second: number
  /** 时间戳 */
  timestamp: number
}

type DelimiterType = 'cn' | 'CN'

/**
 * 获取日期格式字符串
 * @param {number} timestamp 毫秒级时间戳
 * @param {string} delimiter 分隔符默认: /,传入特殊符号: 'cn/CN' 返回中文(例如: 2021年01月01日)
 * @returns {string} 例如: 2021/01/01
 */
export function dateStr(timestamp: number, delimiter: string | DelimiterType = '/'): string {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = autoFillFormat(date.getMonth() + 1)
  const day = autoFillFormat(date.getDate())
  if (delimiter === 'cn' || delimiter === 'CN') {
    return year + '年' + month + '月' + day + '日'
  } else {
    return year + delimiter + month + delimiter + day
  }
}

/**
 * 获取日期时间格式字符串
 * @param {number} timestamp 毫秒级时间戳
 * @param {string | DelimiterType } dateDelimiter 日期分隔符默认: / 'cn/CN' 返回中文(例如: 2021年01月01日 00时00分00秒)
 * @param {string } timeDelimiter 时间分隔符默认: 冒号:
 * @returns {string} 例如: 2021/01/01 08:08:08
 */
export function dateTimeStr(timestamp: number, dateDelimiter: string | DelimiterType = '/', timeDelimiter = ':'): string {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = autoFillFormat(date.getMonth() + 1)
  const day = autoFillFormat(date.getDate())
  const hour = autoFillFormat(date.getHours())
  const minute = autoFillFormat(date.getMinutes())
  const second = autoFillFormat(date.getSeconds())
  if (dateDelimiter === 'cn' || dateDelimiter === 'CN') {
    return year + '年' + month + '月' + day + '日 ' + hour + '时' + minute + '分' + second + '秒'
  } else {
    return year + dateDelimiter + month + dateDelimiter + day + ' ' + hour + timeDelimiter + minute + timeDelimiter + second
  }
}

/**
 * 获取年月日时分秒的对象
 * @param {number} timestamp 毫秒级时间戳
 * @returns {Object} { year, month, day, hour, minute, second, timestamp }
 */
export function dateTimeObject(timestamp: number): DateTimeObject | null {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return { year, month, day, hour, minute, second, timestamp: date.getTime() }
}

/**
 * 不足10自动补零
 * @param {number} num 数字
 * @returns {string} 类型
 */
function autoFillFormat(num: number): string {
  let numStr = ''
  if (num < 10) {
    numStr = `0${num}`
  } else {
    numStr = String(num)
  }
  return numStr
}
