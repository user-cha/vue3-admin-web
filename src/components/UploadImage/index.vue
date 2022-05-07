<!--
 * @Autor: wu
 * @Date: 2022-03-28 16:09:55
 * @Description: 图片上传
 * v-model:single limit默认为1, 返回string类型
 * v-model:multiple 返回string[]
-->

<template>
  <div
    class="upload-image"
    :class="{
      'upload-image-exceed': uploadLimit ? fileList.length === uploadLimit : false,
      'upload-disabled': disabled
    }"
  >
    <el-upload
      :action="ossData.host"
      :data="ossData"
      :file-list="fileList"
      :limit="uploadLimit"
      :disabled="disabled"
      :before-upload="handleBeforeUpload"
      :on-success="handleSuccess"
      :on-remove="handleRemove"
      :on-error="handleError"
      :on-exceed="handleExceed"
      :on-preview="handlePictureCardPreview"
      :on-change="handleChange"
      list-type="picture-card"
      :multiple="uploadLimit === 1 || cropperEnable ? false : true"
      :auto-upload="!cropperEnable"
      ref="elUploadRef"
    >
      <el-icon><plus /></el-icon>
      <template #tip>
        <div class="el-upload__tip">{{ tip }}</div>
      </template>
    </el-upload>
    <!-- 预览图片 -->
    <el-image
      :src="previewPictureSrc"
      :preview-src-list="previewPictureList"
      :initial-index="previewPictureIndex"
      :z-index="5000"
      ref="previewRef"
      class="preview-images"
    />
    <!-- 裁剪图片 -->
    <cropper v-model="cropperVisible" :img="cropperImgUrl" :width="parseInt(width)" :height="parseInt(height)" @change="handleCropperChange" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, watch, computed, nextTick } from 'vue'
import { aliSignature } from './index.service'
import type { AliSignaTureForm, ImageInfo, TemporaryFileUrl } from './index.type'
import { ElMessage, ElImage, UploadRawFile, UploadUserFile, UploadFile, UploadInstance } from 'element-plus'
import Cropper from '@/components/UploadImage/Cropper/index.vue'

const props = defineProps({
  /** 单个图片上传 */
  single: {
    type: String as () => string | undefined,
    default: undefined
  },
  /** 多图片上传 */
  multiple: {
    type: Array as () => string[] | undefined,
    default: undefined
  },
  /** 限制数量 */
  limit: {
    type: Number as () => number | undefined,
    default: undefined
  },
  /** 是否禁用 */
  disabled: {
    type: Boolean,
    default: false
  },
  /** 提示语 */
  tip: {
    type: String,
    default: '只能上传jpg/png/gif文件, 且不超过2MB'
  },
  /** 格式限制 */
  format: {
    type: Array as () => string[],
    default: () => ['image/jpeg', 'image/png', 'image/gif']
  },
  /** 上传大小 MB */
  size: {
    type: Number,
    default: 2
  },
  /** 图片宽度 */
  width: {
    type: String,
    default: '148px'
  },
  /** 图片高度 */
  height: {
    type: String,
    default: '148px'
  },
  /** 是否裁剪 */
  cropperEnable: {
    type: Boolean,
    default: false
  }
})

const fileList = ref<UploadUserFile[]>([])
// 临时文件地址
const temporaryFileUrl: TemporaryFileUrl[] = []
watch(
  () => props.single,
  (newVal) => {
    if (newVal !== undefined) {
      fileList.value = newVal
        ? [
            {
              name: newVal,
              url: newVal,
              status: 'success',
              uid: 1
            }
          ]
        : []
    }
  },
  {
    immediate: true
  }
)
watch(
  () => props.multiple,
  (newVal) => {
    if (newVal !== undefined) {
      fileList.value = newVal.map((item, index) => {
        return {
          name: item,
          url: item,
          status: 'success',
          uid: index + 1
        }
      })
    }
  },
  {
    immediate: true
  }
)
const uploadLimit = computed<number | undefined>(() => {
  return props.single ? 1 : props.limit
})

/** 获取签名 */
const ossData = reactive<AliSignaTureForm>({
  host: '',
  policy: '',
  OSSAccessKeyId: '',
  signature: '',
  finalExpireTimeMillis: 0,
  originalKey: '',
  key: ''
})
const getAliSignature = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    aliSignature()
      .then(({ data }) => {
        ossData.host = data.host
        ossData.policy = data.policy
        ossData.OSSAccessKeyId = data.accessKeyId
        ossData.signature = data.signature
        ossData.originalKey = data.key
        ossData.finalExpireTimeMillis = Date.now() + data.finalExpireTimeMillis
        sessionStorage.setItem('ossData', JSON.stringify(ossData))
        resolve(true)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
/** 初始化数据 */
const isFinish = ref(false)
const initData = async (): Promise<void> => {
  try {
    const ossDataCache = sessionStorage.getItem('ossData')
    if (ossDataCache) {
      const ossDataObject: AliSignaTureForm = JSON.parse(ossDataCache)
      ossData.host = ossDataObject.host
      ossData.policy = ossDataObject.policy
      ossData.OSSAccessKeyId = ossDataObject.OSSAccessKeyId
      ossData.signature = ossDataObject.signature
      ossData.finalExpireTimeMillis = ossDataObject.finalExpireTimeMillis
      ossData.originalKey = ossDataObject.originalKey
      ossData.key = ossDataObject.key
    } else {
      await getAliSignature()
    }
    isFinish.value = true
  } catch (error) {
    console.error('await:', error)
  }
}
const checkFile = (rawFile: UploadRawFile): boolean => {
  const isFormatLegality = props.format.includes(rawFile.type)
  if (!isFormatLegality) {
    ElMessage({
      message: '请上传合法的图片格式!',
      type: 'warning'
    })
    return false
  }
  const isSizeLegality = rawFile.size / 1024 / 1024 < props.size
  if (!isSizeLegality) {
    ElMessage({
      message: `上传大小不能超过${props.size}MB!`,
      type: 'warning'
    })
    return false
  }
  return true
}
/** 上传前的钩子 */
const handleBeforeUpload = async (rawFile: UploadRawFile): Promise<boolean> => {
  if (!isFinish.value) {
    ElMessage({
      message: '正在获取上传签名, 请重试!',
      type: 'warning'
    })
  }
  const checkRes = checkFile(rawFile)
  if (!checkRes) {
    return Promise.reject(checkRes)
  }
  try {
    const dateNow = Date.now()
    if (dateNow >= ossData.finalExpireTimeMillis) {
      await getAliSignature()
    }
    const imageInfo = await getImageInfo(rawFile)
    const fileFormat = rawFile.name.substring(rawFile.name.lastIndexOf('.'))
    ossData.key = ossData.originalKey + rawFile.uid + `-w${imageInfo.width}-h${imageInfo.height}${fileFormat}`
    // 存储到临时路径
    temporaryFileUrl.push({
      uid: rawFile.uid,
      url: ossData.host + '/' + ossData.key
    })
    return Promise.resolve(true)
  } catch (error) {
    return Promise.reject(error)
  }
}
/** 上传成功的钩子 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleSuccess = (_response: any, uploadFile: UploadFile): void => {
  const findData = fileList.value.find((item) => item.uid === uploadFile.uid)
  const findTempIndex = temporaryFileUrl.findIndex((item) => item.uid === uploadFile.uid)
  if (findData && findTempIndex !== -1) {
    findData.url = temporaryFileUrl[findTempIndex].url
    temporaryFileUrl.splice(findTempIndex, 1)
    updateModelVal()
  } else {
    console.error('未在FileList/temporaryFileUrl查到数据!')
  }
}
/** 移除文件的钩子 */
const handleRemove = (): void => {
  updateModelVal()
}
/** 上传失败的钩子 */
const handleError = (error: Error): void => {
  $Notify({
    title: '消息',
    message: String(error),
    type: 'error'
  })
}
/** 上传超出限制的钩子 */
const handleExceed = (): void => {
  ElMessage({
    message: `最多上传${uploadLimit.value}张图片!`,
    type: 'warning'
  })
}
/** 更新v-model的值 */
const emits = defineEmits(['update:single', 'update:multiple'])
const updateModelVal = (): void => {
  if (props.single !== undefined) {
    const modelValue = fileList.value.length > 0 ? fileList.value[0].url : ''
    emits('update:single', modelValue)
  } else {
    const modelValue = fileList.value.map((item) => <string>item.url)
    emits('update:multiple', modelValue)
  }
}
/** 获取图片信息 */
const getImageInfo = (file: UploadRawFile): Promise<ImageInfo> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const image = new Image()
      image.src = <string>reader.result
      image.onload = () => {
        resolve({ width: image.width, height: image.height })
      }
      image.onerror = (error) => {
        reject(error)
      }
    }
    reader.onerror = (error) => {
      reject(error)
    }
  })
}

/** 预览图片 */
const previewPictureSrc = ref<string>('')
const previewPictureList = ref<string[]>([])
const previewPictureIndex = ref<number>(0)
const previewRef = ref<typeof ElImage>()
const handlePictureCardPreview = (file: UploadFile): void => {
  previewPictureList.value = fileList.value.map((item) => <string>item.url)
  previewPictureIndex.value = fileList.value.findIndex((item) => item.uid === file.uid)
  previewPictureSrc.value = <string>fileList.value[previewPictureIndex.value].url
  nextTick(() => {
    if (!previewRef.value) return
    previewRef.value.clickHandler()
  })
}

/** 图片裁剪 */
const cropperVisible = ref(false)
const cropperFile = ref<UploadFile | null>(null)
const cropperImgUrl = ref<string>('')
/** 文件改变时的钩子 */
const handleChange = (file: UploadFile): void => {
  if (props.cropperEnable && file.status === 'ready') {
    const checkRes = checkFile(<UploadRawFile>file.raw)
    if (checkRes) {
      cropperFile.value = file
      cropperImgUrl.value = file.url || ''
      cropperVisible.value = true
    }
  }
}
const elUploadRef = ref<UploadInstance>()
/** 裁剪改变后的钩子(只要裁剪弹窗关闭就会触发) */
const handleCropperChange = (data: Blob | null): void => {
  if (!elUploadRef.value || !cropperFile.value) return
  if (data) {
    const currentFile = new File([data], '裁剪图片.png', { type: 'image/png' })
    cropperFile.value.raw = currentFile as UploadRawFile
    cropperFile.value.raw.uid = cropperFile.value.uid
    cropperFile.value.url = URL.createObjectURL(data)
    elUploadRef.value.submit()
  } else {
    elUploadRef.value.handleRemove(cropperFile.value)
  }
  // 清除当前变量
  cropperFile.value = null
}

// 页面挂载完毕
onMounted(() => {
  initData()
})
</script>

<style scoped lang="scss">
.upload-image {
  display: inline-flex;
  :deep() {
    .el-upload--picture-card,
    .el-upload-list--picture-card .el-upload-list__item {
      margin: 0 8px 8px 0;
      width: v-bind('props.width');
      height: v-bind('props.height');
    }
  }
  &.upload-image-exceed {
    :deep() {
      .el-upload--picture-card {
        display: none;
      }
    }
  }
  &.upload-disabled {
    :deep() {
      .el-upload--picture-card {
        border: 1px dashed #c0ccda;
        cursor: not-allowed;
      }
    }
  }
  .preview-images {
    width: 0;
    height: 0;
    overflow: hidden;
    position: absolute;
  }
}
</style>
