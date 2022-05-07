<!--
 * @Autor: ll
 * @Date: 2022-04-24 16:09:51
 * @Description: 分配权限
-->

<template>
  <div class="dialog">
    <el-dialog v-model="dialogVisible" title="分配权限" :close-on-click-modal="false" width="600px" @open="handleOpen()" @closed="handleClosed()">
      <el-tree
        ref="treeRef"
        :data="treeData"
        show-checkbox
        node-key="id"
        :default-checked-keys="selectedData"
        :props="{
          label: 'name'
        }"
        v-loading="loading"
      />
      <template #footer>
        <span>
          <el-button @click="handleCancel()">取 消</el-button>
          <el-button type="primary" @click="handleConfirm()" :loading="loading">确 认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { permissionTree, permissionSetup } from '../index.service'
import type { RolePermissionTreeRes } from '../index.type'
import type { ElTree } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  id: {
    type: String,
    default: ''
  }
})
const emits = defineEmits(['update:modelValue'])

/** 弹窗基础属性 */
const dialogVisible = ref(false)
watch(
  () => props.modelValue,
  (newVal) => {
    dialogVisible.value = newVal
  },
  {
    immediate: true
  }
)
const treeData = ref<RolePermissionTreeRes[]>([])
const selectedData = ref<string[]>([])
const filterSelectedData = (data: RolePermissionTreeRes[]): string[] => {
  let ids: string[] = []
  data.forEach((item) => {
    let childIds: string[] = []
    if (item.children.length < 1 && item.selected) {
      ids.push(item.id)
    } else {
      childIds = filterSelectedData(item.children)
    }
    ids = ids.concat(childIds)
  })
  return ids
}
/** 打开弹窗 */
const handleOpen = async (): Promise<void> => {
  try {
    loading.value = true
    const { data } = await permissionTree({ roleId: props.id })
    treeData.value = data
    selectedData.value = filterSelectedData(data)
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
/** 关闭弹窗 */
const handleClosed = (): void => {
  treeRef.value?.setCheckedKeys([])
  emits('update:modelValue', false)
}
/** 点击取消 */
const handleCancel = (): void => {
  dialogVisible.value = false
}

/** 点击确认 */
const loading = ref(false)
const treeRef = ref<InstanceType<typeof ElTree>>()
const handleConfirm = async (): Promise<void> => {
  if (!treeRef.value) return
  try {
    const checkedKeys = treeRef.value.getCheckedKeys()
    const permissionIds = checkedKeys.concat(treeRef.value.getHalfCheckedKeys())
    await permissionSetup({ roleId: props.id, permissionIds: permissionIds.join(',') })
    $Notify({
      title: '消息',
      message: '操作成功',
      type: 'success'
    })
    handleCancel()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss"></style>
