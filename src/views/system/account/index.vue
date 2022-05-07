<!--
 * @Autor: wu
 * @Date: 2022-04-27 13:44:12
 * @Description: 账号管理
-->

<route>
{
  name: "systemAccount",
  meta: {
    icon: 'system-account',
    title: "账号管理",
    sort: 4
  }
}
</route>

<template>
  <div class="app-container" v-loading="loading">
    <!-- 条件筛选部分 -->
    <div class="app-section">
      <div class="app-aside">筛选条件</div>
      <div class="app-article">
        <div class="app-item">
          <el-input v-model="condition.nameLike" placeholder="请输入账号/真实姓名" @keyup.enter="initTableData()">
            <template #append>
              <el-button icon="search" @click="initTableData()" />
            </template>
          </el-input>
        </div>
      </div>
    </div>
    <!-- 功能操作 -->
    <div class="app-section">
      <div class="app-aside">功能操作</div>
      <div class="app-article">
        <div class="app-item">
          <el-button type="primary" icon="plus" @click="openDialog('add')">新增</el-button>
        </div>
        <div class="app-item">
          <el-popconfirm
            title="确定要批量删除吗?"
            @confirm="handleTableDelete({ ids: tableMultipleSelection.map((item) => item.id).join(',') }, tableMultipleSelection.length)"
            :disabled="tableMultipleSelection.length === 0"
          >
            <template #reference>
              <el-button type="danger" icon="delete" :disabled="tableMultipleSelection.length === 0">批量删除</el-button>
            </template>
          </el-popconfirm>
        </div>
      </div>
    </div>
    <!-- 表格数据 -->
    <div class="app-table">
      <el-table :data="tableData" @selection-change="handleTableSelection" :sort-change="handleSortChange" height="100%">
        <el-table-column type="selection" width="55" />
        <el-table-column label="用户账号" min-width="100" show-overflow-tooltip>
          <template #default="scope">{{ scope.row.account }}</template>
        </el-table-column>
        <el-table-column label="真实姓名" min-width="100" show-overflow-tooltip>
          <template #default="scope">{{ scope.row.realName || '--' }}</template>
        </el-table-column>
        <el-table-column label="创建时间" width="170">
          <template #default="scope">{{ dateTimeStr(scope.row.createStamp) }}</template>
        </el-table-column>
        <el-table-column label="启用状态" width="80">
          <template #default="scope">
            <el-switch v-model="scope.row.enabled" @change="handleEnable(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="150">
          <template #default="scope">
            <el-link icon="edit" @click="openDialog('edit', scope.row.id)">编辑</el-link>
            <el-popconfirm title="确定要删除吗?" @confirm="handleTableDelete({ ids: scope.row.id }, 1)">
              <template #reference>
                <el-link icon="delete">删除</el-link>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="app-pagination">
      <el-pagination
        v-model:currentPage="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :page-sizes="pagination.pageSizes"
        background
        :layout="pagination.layout"
        :total="pagination.totalCount"
      />
    </div>
    <!-- 新增/编辑 -->
    <add-and-edit v-model="dialogShow" :id="dialogId" :type="dialogType" :handle-update-info="getTableData" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { accountPage, accountDelete, accountEnable } from './index.service'
import type { AccountPageParams, AccountPageRes } from './index.type'
import type { AddEditType, DeleteParams } from '@/service/common.type'
import { dateTimeStr } from '@/utils/dateFormat'
import PageHooks from '@/utils/pageHooks'
import AddAndEdit from './components/AddAndEdit.vue'

const condition = reactive({
  nameLike: ''
})
const {
  loading,
  tableData,
  tableMultipleSelection,
  getTableData,
  initTableData,
  handleTableSelection,
  handleSortChange,
  handleTableDelete,
  pagination
} = PageHooks<AccountPageRes>({
  pageApi: accountPage,
  delApi: accountDelete,
  condition
})

/** 禁用/启用 */
const handleEnable = async (data: AccountPageRes): Promise<void> => {
  try {
    await accountEnable({ ids: data.id, enable: data.enabled })
  } catch (error) {
    data.enabled = !data.enabled
  }
}

/** 新增/编辑 弹窗 */
const dialogShow = ref(false)
const dialogId = ref('')
const dialogType = ref<AddEditType>('add')
const openDialog = (type: AddEditType, id?: string): void => {
  dialogId.value = id || ''
  dialogType.value = type
  dialogShow.value = true
}

onMounted(() => {
  initTableData()
})
</script>

<style scoped lang="scss"></style>
