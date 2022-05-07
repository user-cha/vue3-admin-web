/*
 * @Autor: ll
 * @Date: 2022-03-11 15:34:33
 * @Description: HTTP请求封装
 */

import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse, Canceler, Method, AxiosRequestHeaders, ResponseType } from 'axios'
import Config from '@/library/config'
import Qs from 'qs'
import Cookies from 'js-cookie'
import Router from '@/library/router'

/**
 * 请求参数
 */
export interface RequestConfig {
  /** 自定义请求头类型 */
  headers: AxiosRequestHeaders
  /** 指定用于取消请求的 cancel token */
  cancelToken: Canceler
  /** 请求参数类型 */
  paramsType: 'json' | 'form'
  /** 响应参数类型 */
  responseType: ResponseType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUploadProgress?: (progressEvent: any) => void // 允许为上传处理进度事件
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDownloadProgress?: (progressEvent: any) => void // 允许为下载处理进度事件
}

/**
 * 返回参数
 */
export interface ResponseStructure<T> {
  code: number
  data: T
  msg: string
}

/**
 * 自定义创建axios实例对象
 */
const service = Axios.create({
  baseURL: '/' + Config.backendProjectName,
  timeout: Config.httpTimeOut
})

/** 请求拦截器 */
service.interceptors.request.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

/** 响应拦截器 */
service.interceptors.response.use(
  (response: AxiosResponse) => {
    if (typeof response.data === 'object') {
      const res = response.data
      if (Config.httpSuccessCode.includes(res.code)) {
        return response
      } else {
        return Promise.reject(<ResponseStructure<null>>res)
      }
    } else {
      return response
    }
  },
  (error: AxiosError) => {
    return Promise.reject({ code: -1, data: null, msg: error.message })
  }
)

/**
 * axios 请求方式封装
 * @param url 请求地址
 * @param method 请求方法
 * @param data 请求数据
 * @param config 请求配置参数
 * @returns 返回 Promise<ResponseStructure<R>>
 */
function request<P, R>(url: string, method: Method, data?: P, config?: RequestConfig): Promise<ResponseStructure<R>> {
  return new Promise((resolve, reject) => {
    const cancelToken = Axios.CancelToken
    let canceler: Canceler
    const params: AxiosRequestConfig<P | string> = {
      url,
      method,
      cancelToken: new cancelToken((cancel) => {
        canceler = cancel
        if (config?.cancelToken) {
          config.cancelToken = cancel
        }
      })
    }
    if ('get/GET/delete/DELETE'.includes(method)) {
      params.params = data
    } else {
      switch (config?.paramsType) {
        case 'json':
          params.headers = {
            'Content-Type': 'application/json'
          }
          params.data = data
          break
        case 'form':
        case undefined:
          params.headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
          params.data = data ? Qs.stringify(data) : ''
          break
      }
    }
    service(params)
      .then((response: AxiosResponse<ResponseStructure<R>, P>) => {
        resolve(response.data)
      })
      .catch((error: ResponseStructure<R>) => {
        interceptorError(error, canceler)
        reject(error)
      })
  })
}

/** 错误响应的拦截器 */
function interceptorError<T>(error: ResponseStructure<T>, canceler: Canceler): void {
  if (Config.httpIllegalCode.includes(error.code)) {
    // 防止非法登录后重复请求
    const axiosFlag = Cookies.get('axios-flag')
    if (axiosFlag) {
      // 取消请求
      canceler()
    } else {
      Cookies.set('axios-flag', '1')
      setTimeout(() => {
        Cookies.remove('axios-flag')
      }, 300)
      $Notify({
        title: '消息',
        message: error.msg,
        type: 'warning'
      })
      // 清除token
      Cookies.remove(Config.tokenName)
      Router.push({ name: 'login' })
    }
  } else {
    if (Config.globalErrorEnable) {
      $Notify({
        title: '消息',
        message: error.msg,
        type: 'warning'
      })
    }
  }
}

function GET<P, R = null>(url: string, data?: P, config?: RequestConfig) {
  return request<P, R>(url, 'get', data, config)
}

function POST<P, R = null>(url: string, data?: P, config?: RequestConfig) {
  return request<P, R>(url, 'post', data, config)
}

function PUT<P, R = null>(url: string, data?: P, config?: RequestConfig) {
  return request<P, R>(url, 'put', data, config)
}

function DELETE<P, R = null>(url: string, data?: P, config?: RequestConfig) {
  return request<P, R>(url, 'delete', data, config)
}

export default { GET, POST, PUT, DELETE, REQUREST: request }
