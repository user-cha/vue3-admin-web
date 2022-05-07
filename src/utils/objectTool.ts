/*
 * @Autor: ll
 * @Date: 2022-04-13 09:56:23
 * @Description: 对象操作的常用方法
 */

/**
 * 给对象表单快速赋值
 * @param formData 需要赋值的对象表单
 * @param data 数据源
 * @returns void
 */
export function fastAssignmentValue(formData, data): void {
  for (const key in formData) {
    if (Object.prototype.hasOwnProperty.call(formData, key) && data[key] !== undefined) {
      formData[key] = data[key]
    }
  }
}
