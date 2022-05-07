<!--
 * @Autor: ll
 * @Date: 2022-04-13 16:11:56
 * @Description: 图片裁剪
-->

<template>
  <div class="cropper">
    <el-dialog v-model="dialogVisible" title="图片裁剪" :close-on-click-modal="false" width="1000px" @open="handleOpen()" @closed="handleClosed()">
      <div class="cropper-main">
        <vue-cropper
          ref="cropperRef"
          :img="cropperOption.img"
          :output-size="cropperOption.outputSize"
          :auto-crop="cropperOption.autoCrop"
          :auto-crop-width="cropperOption.autoCropWidth"
          :auto-crop-height="cropperOption.autoCropHeight"
          :fixed="cropperOption.fixed"
          :fixed-number="cropperOption.fixedNumber"
          :full="cropperOption.full"
          :fixed-box="cropperOption.fixedBox"
          :can-move="cropperOption.canMove"
          :can-move-box="cropperOption.canMoveBox"
          :original="cropperOption.original"
          :center-box="cropperOption.centerBox"
          :info-true="cropperOption.infoTrue"
          :max-img-size="cropperOption.maxImgSize"
        />
      </div>
      <el-space class="app-mt">
        <el-button type="primary" icon="refresh-left" @click="handleRotate('left')">左旋转</el-button>
        <el-button type="primary" icon="refresh-right" @click="handleRotate('right')">右旋转</el-button>
        <el-button type="primary" icon="zoom-in" @click="handleZoom('in')">放大</el-button>
        <el-button type="primary" icon="zoom-out" @click="handleZoom('out')">缩小</el-button>
        <el-button type="primary" icon="refresh" @click="handleRefresh()">初始状态</el-button>
        <el-button type="primary" icon="upload-filled" @click="downLoadFile()">下载图片</el-button>
      </el-space>
      <el-space class="app-mt" :size="30">
        <el-checkbox v-model="cropperOption.fixed" label="比例裁剪" />
        <el-checkbox v-model="cropperOption.canMove" label="原图片可移动" />
        <el-checkbox v-model="cropperOption.canMoveBox" label="裁剪框可拖动" />
        <el-checkbox v-model="cropperOption.centerBox" label="裁剪框限制在原图片" />
      </el-space>
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
import 'vue-cropper/dist/index.css'
// import { VueCropper } from 'vue-cropper'
import { ref, reactive, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  /** 需要裁剪的图片 */
  img: {
    type: String,
    default: ''
  },
  /** 裁剪的宽 */
  width: {
    type: Number,
    default: 0
  },
  /** 裁剪的高 */
  height: {
    type: Number,
    default: 0
  }
})
const emits = defineEmits(['update:modelValue', 'change'])
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

/** 打开弹窗 */
const handleOpen = (): void => {
  cropperOption.img = props.img
  cropperOption.autoCropWidth = props.width || 80
  cropperOption.autoCropHeight = props.height || 80
  cropperOption.fixedNumber = [cropperOption.autoCropWidth, cropperOption.autoCropHeight]
}
/** 关闭弹窗 */
const handleClosed = (): void => {
  cropperOption.img = ''
  cropperOption.autoCropWidth = 80
  cropperOption.autoCropWidth = 80
  cropperOption.fixedNumber = [1, 1]
  emits('update:modelValue', false)
  emits('change', currentBlob)
  currentBlob = null
}
/** 点击取消 */
const handleCancel = (): void => {
  dialogVisible.value = false
}

/** 点击确认 */
const loading = ref(false)
let currentBlob: Blob | null = null
const handleConfirm = (): void => {
  if (!cropperRef.value || props.img === '') return
  cropperRef.value.getCropBlob((data: Blob) => {
    currentBlob = data
    dialogVisible.value = false
  })
}

const cropperOption = reactive({
  /** 图片的地址 */
  img: '',
  /** 图片质量 0.1~1 */
  outputSize: 1,
  /** 默认生成截图框开关 */
  autoCrop: true,
  /** 默认截图框宽度 */
  autoCropWidth: 80,
  /** 默认截图框高度 */
  autoCropHeight: 80,
  /** 截图框宽高比例开关 */
  fixed: true,
  /** 截图框宽高比例 */
  fixedNumber: [1, 1],
  /** 原比例输出截图比例 */
  full: true,
  /** 固定裁剪框大小是否能改变 */
  fixedBox: false,
  /** 上传图片是否可以移动 */
  canMove: false,
  /** 截图框能否拖动 */
  canMoveBox: true,
  /** 上传图片按照原始比例渲染 */
  original: true,
  /** 截图框是否被限制在图片里面 */
  centerBox: true,
  /** true 为展示真实输出图片宽高 false 展示看到的截图框宽高 */
  infoTrue: true,
  /** 限制图片最大宽度和高度 */
  maxImgSize: 8192
})

const cropperRef = ref<typeof VueCropper>()
/** 旋转 */
const handleRotate = (type: 'left' | 'right'): void => {
  if (!cropperRef.value) return
  if (type === 'left') {
    cropperRef.value.rotateLeft()
  } else {
    cropperRef.value.rotateRight()
  }
}
/** 缩放 */
const handleZoom = (type: 'in' | 'out'): void => {
  if (!cropperRef.value) return
  if (type === 'in') {
    cropperRef.value.changeScale(1)
  } else {
    cropperRef.value.changeScale(-1)
  }
}
/** 重制 */
const handleRefresh = (): void => {
  if (!cropperRef.value) return
  cropperRef.value.refresh()
}
/** 下载图片 */
const downLoadFile = (): void => {
  if (!cropperRef.value) return
  cropperRef.value.getCropData((data: string) => {
    const aDom = document.createElement('a')
    aDom.setAttribute('href', data)
    aDom.setAttribute('download', '裁剪图片.png')
    aDom.click()
    aDom.remove()
  })
}
</script>

<style scoped lang="scss">
.cropper {
  .cropper-main {
    height: 400px;
  }
}
</style>
