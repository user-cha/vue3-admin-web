/*
 * @Autor: ll
 * @Date: 2022-04-21 15:35:00
 * @Description: 页面所用到的方法和数据
 */

import { ref, reactive, Ref } from 'vue'
import type { PaginationCondition, PaginationStructure } from '@/service/common.type'
import type { ResponseStructure } from '@/library/service'

type PageHookParams<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pageApi?: (params: any) => Promise<ResponseStructure<PaginationStructure<T>>>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listApi?: (params: any) => Promise<ResponseStructure<T[]>>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delApi?: (params: any) => Promise<ResponseStructure<null>>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  condition: any
}
/**
 * 页面的通用方法及变量Hooks
 * @param pageApi 分页接口
 * @param listApi 列表接口
 * @param delApi 删除/批量删除接口
 */
export default function <T>(params: PageHookParams<T>) {
  /** 加载中 */
  const loading = ref(false)
  /** 表格数据 */
  const tableData = ref<T[]>([]) as Ref<T[]>
  /** 已选中的数据 */
  const tableMultipleSelection = ref<T[]>([]) as Ref<T[]>
  /** 分页 */
  const pagination = reactive({
    currentPage: 1,
    pageSize: 10,
    pageSizes: [10, 20, 50, 100, 1000],
    totalCount: 0,
    totalPage: 0,
    layout: 'total, sizes, prev, pager, next, jumper'
  })
  /** 获取表格数据 */
  const getTableData = async () => {
    if (params.listApi) {
      const { data } = await params.listApi(params.condition)
      tableData.value = data
    } else if (params.pageApi) {
      const original: PaginationCondition = {
        currentPage: pagination.currentPage,
        pageSize: pagination.pageSize,
        ...sortCondition
      }
      const arg = params.condition ? Object.assign(params.condition, original) : original
      const { data } = await params.pageApi(arg)
      pagination.currentPage = data.pageNum
      pagination.pageSize = data.pageSize
      pagination.totalCount = data.totalCount
      pagination.totalPage = data.totalPage
      tableData.value = data.list
    }
    return tableData.value
  }
  /** 初始化表格数据 */
  const initTableData = async () => {
    try {
      loading.value = true
      pagination.currentPage = 1
      await getTableData()
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }
  /** 选择数据 */
  const handleTableSelection = (val: T[]): void => {
    tableMultipleSelection.value = val
  }
  /** 排序变化 */
  const sortCondition = reactive({
    property: '',
    mode: false
  })
  const handleSortChange = ({ column }): void => {
    switch (column.order) {
      case 'ascending':
        sortCondition.mode = true
        break
      case 'descending':
        sortCondition.mode = false
        break
      default:
        sortCondition.property = ''
        sortCondition.mode = false
    }
    initTableData()
  }
  /**
   * 删除数据
   * @param condition 筛选条件
   * @param delNum  删除个数
   */
  const handleTableDelete = async (condition: object, delNum: number): Promise<void> => {
    try {
      if (!params.delApi) {
        console.error('不存在的方法')
        return
      }
      loading.value = true
      await params.delApi(condition)
      // 删除后判断是否是当前页面的最后一跳,如果是最后一跳,往前退一格
      const totalPage = Math.ceil((pagination.totalPage - delNum) / pagination.pageSize)
      if (pagination.currentPage > totalPage) {
        pagination.currentPage = totalPage || 1
      }
      await getTableData()
      $Notify({
        title: '消息',
        message: '删除成功',
        type: 'success'
      })
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    tableData,
    tableMultipleSelection,
    pagination,
    getTableData,
    initTableData,
    handleTableSelection,
    handleSortChange,
    handleTableDelete
  }
}
