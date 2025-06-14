import { reactive, toRaw } from 'vue'

// 分页钩子函数
interface Options {
  current?: number
  size?: number
  fetchFun: (_arg: any) => Promise<any>
  params?: Record<any, any>
  fixedParams?: Record<any, any>
  firstLoading?: boolean
}

export function usePaging(options: Options) {
  const {
    current = 1,
    size = 20,
    fetchFun,
    params = {},
    fixedParams = {},
    firstLoading = false
  } = options
  // 记录分页初始参数
  const paramsInit: Record<any, any> = Object.assign({}, toRaw(params))
  // 分页数据
  const pager = reactive({
    current,
    size,
    loading: firstLoading,
    count: 0,
    lists: [] as any[],
    extend: {} as Record<string, any>
  })
  // 请求分页接口
  const getLists = async () => {
    pager.loading = true
    return await fetchFun({
      current: pager.current,
      size: pager.size,
      ...params,
      ...fixedParams
    })
      .then((res: any) => {
        pager.count = res?.total
        pager.lists = res?.records
        pager.extend = res?.extend
        return Promise.resolve(res)
      })
      .catch((err: any) => {
        return Promise.reject(err)
      })
      .finally(() => {
        pager.loading = false
      })
  }
  // 重置为第一页
  const resetPage = async () => {
    pager.current = 1
    await getLists()
  }
  // 重置参数
  const resetParams = async () => {
    Object.keys(paramsInit).forEach((item) => {
      params[item] = paramsInit[item]
    })
    await getLists()
  }
  const refresh = async () => {
    await getLists()
  }
  return {
    pager,
    getLists,
    resetParams,
    resetPage,
    refresh
  }
}
