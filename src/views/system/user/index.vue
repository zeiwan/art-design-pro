<template>
  <ArtTableFullScreen>
    <div class="account-page" id="table-full-screen">
      <!-- 搜索栏 -->
      <ArtSearchBar
        v-model:filter="formFilters"
        :items="formItems"
        @reset="resetParams"
        @search="resetPage"
      ></ArtSearchBar>

      <ElCard shadow="never" class="art-table-card">
        <!-- 表格头部 -->
        <ArtTableHeader v-model:columns="columnChecks" @refresh="refresh">
          <template #left>
            <ElButton @click="handleAdd('add', undefined)">新增用户</ElButton>
          </template>
        </ArtTableHeader>

        <!-- 表格 -->
        <ArtTable
          ref="tableRef"
          row-key="id"
          :loading="pager.loading"
          :data="pager.lists"
          :total="pager.count"
          :marginTop="10"
          @selection-change="handleSelectionChange"
        >
          <template #default>
            <ElTableColumn v-for="col in columns" :key="col.prop || col.type" v-bind="col" />
          </template>
          <template #pagination>
            <pagination v-model="pager" @change="getLists" />
          </template>
        </ArtTable>
      </ElCard>
    </div>
    <EditPopup
      ref="editRef"
      @success="getLists"
      @close="showEdit = false"
      v-if="showEdit"
    ></EditPopup>
  </ArtTableFullScreen>
</template>

<script setup lang="ts">
  import { h } from 'vue'
  import { ACCOUNT_TABLE_DATA } from '@/mock/temp/formData'

  import { ElTag } from 'element-plus'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import { useCheckedColumns } from '@/composables/useCheckedColumns'
  import ArtButtonTable from '@/components/core/forms/ArtButtonTable.vue'
  import { UserService } from '@/api/usersApi'
  import { SearchChangeParams, SearchFormItem } from '@/types'
  import { usePaging } from '@/hooks'
  import EditPopup from './edit.vue'
  import { initialSearchState } from '@/views/system/user/common'

  defineOptions({ name: 'User' }) // 定义组件名称，用于 KeepAlive 缓存控制

  const editRef = shallowRef<InstanceType<typeof EditPopup>>()
  const { width } = useWindowSize()
  const showEdit = ref(false)

  // 响应式表单数据
  const formFilters = reactive({ ...initialSearchState })
  const { pager, getLists, resetParams, resetPage, refresh } = usePaging({
    fetchFun: UserService.getUserList,
    params: formFilters
  })

  // 表格实例引用
  const tableRef = ref()

  // 选中的行数据
  const selectedRows = ref<any[]>([])

  // 表单项变更处理
  const handleFormChange = (params: SearchChangeParams): void => {
    console.log('表单项变更:', params)
    if (params.prop === 'daterange') {
      // 断言 params.val 为 any[] 类型
      const dateRange = params.val as any[]

      if (dateRange && dateRange.length >= 2) {
        formFilters.create_time_start = dateRange[0]
        formFilters.create_time_end = dateRange[1]
      }
    }
  }

  // 表单配置项
  const formItems: SearchFormItem[] = [
    {
      label: '用户名',
      prop: 'userName',
      type: 'input',
      config: {
        clearable: true
      },
      onChange: handleFormChange
    },

    {
      label: '电话',
      prop: 'userPhone',
      type: 'input',
      config: {
        clearable: true
      },
      onChange: handleFormChange
    },
    {
      label: '用户等级',
      prop: 'level',
      type: 'select',
      config: {
        clearable: true
      },
      options: () => [
        { label: '普通用户', value: 'normal' },
        { label: 'VIP用户', value: 'vip' },
        { label: '高级VIP', value: 'svip' },
        { label: '企业用户', value: 'enterprise', disabled: true }
      ],
      onChange: handleFormChange
    },
    {
      label: '地址',
      prop: 'address',
      type: 'input',
      config: {
        clearable: true
      },
      onChange: handleFormChange
    },
    {
      label: '邮箱',
      prop: 'email',
      type: 'input',
      config: {
        clearable: true
      },
      onChange: handleFormChange
    },
    // 支持 9 种日期类型定义
    // 具体可参考 src/components/core/forms/art-search-bar/widget/art-search-date/README.md
    {
      prop: 'date',
      label: '日期',
      type: 'date',
      config: {
        type: 'date',
        placeholder: '请选择日期'
      }
    },
    {
      prop: 'daterange',
      label: '日期范围',
      type: 'daterange',
      config: {
        type: 'daterange',
        startPlaceholder: '开始时间',
        endPlaceholder: '结束时间'
      },
      onChange: handleFormChange
    },
    {
      label: '状态',
      prop: 'status',
      type: 'radio',
      options: [
        { label: '在线', value: '1' },
        { label: '离线', value: '2' }
      ],
      onChange: handleFormChange
    }
  ]

  // 获取标签类型
  // 1: 在线 2: 离线 3: 异常 4: 注销
  const getTagType = (status: string) => {
    switch (status) {
      case '1':
        return 'success'
      case '2':
        return 'info'
      case '3':
        return 'warning'
      case '4':
        return 'danger'
      default:
        return 'info'
    }
  }

  // 构建标签文本
  const buildTagText = (status: string) => {
    let text = ''
    if (status === '1') {
      text = '在线'
    } else if (status === '2') {
      text = '离线'
    } else if (status === '3') {
      text = '异常'
    } else if (status === '4') {
      text = '注销'
    }
    return text
  }

  // 显示对话框
  const handleAdd = async (type: string, row: any) => {
    showEdit.value = true
    await nextTick()
    editRef.value?.open(type)
    if (editRef.value) {
      editRef.value.setFormData(row)
    }
  }

  // 删除用户
  const deleteUser = (row: any) => {
    ElMessageBox.confirm(`确定要注销该 ${row.userName} 用户吗？`, '注销用户', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    }).then(() => {
      ElMessage.success('注销成功')
    })
  }

  // 动态列配置
  const { columnChecks, columns } = useCheckedColumns(() => [
    { type: 'selection' }, // 勾选列
    // { type: 'expand', label: '展开', width: 80 }, // 展开列
    // { type: 'index', label: '序号', width: 80 }, // 序号列
    {
      prop: 'avatar',
      label: '用户名',
      minWidth: width.value < 500 ? 220 : '',
      formatter: (row: any) => {
        return h('div', { class: 'user', style: 'display: flex; align-items: center' }, [
          h('img', { class: 'avatar', src: row.avatar }),
          h('div', {}, [
            h('p', { class: 'user-name' }, row.userName),
            h('p', { class: 'email' }, row.userEmail)
          ])
        ])
      }
    },
    {
      prop: 'userGender',
      label: '性别',
      sortable: true,
      formatter: (row) => (row.userGender === 1 ? '男' : '女')
    },
    { prop: 'userPhone', label: '手机号' },
    {
      prop: 'status',
      label: '状态',
      formatter: (row) => {
        return h(ElTag, { type: getTagType(row.status) }, () => buildTagText(row.status))
      }
    },
    {
      prop: 'createTime',
      label: '创建日期',
      sortable: true
    },
    {
      prop: 'operation',
      label: '操作',
      width: 150,
      // fixed: 'right', // 固定在右侧
      // disabled: true,
      formatter: (row: any) => {
        return h('div', [
          h(ArtButtonTable, {
            type: 'edit',
            onClick: () => handleAdd('edit', row)
          }),
          h(ArtButtonTable, {
            type: 'delete',
            onClick: () => deleteUser(row)
          })
        ])
      }
    }
  ])

  // 处理表格行选择变化
  const handleSelectionChange = (selection: any[]) => {
    selectedRows.value = selection
  }

  onMounted(() => {
    getLists()
  })
  //  监听列表数据变化，动态设置头像图片路径
  watchSyncEffect(() => {
    if (pager.lists.length > 0) {
      pager.lists = pager.lists.map((item: any, index: number) => ({
        ...item,
        avatar: ACCOUNT_TABLE_DATA[index % ACCOUNT_TABLE_DATA.length].avatar
      }))
    }
  })
</script>

<style lang="scss" scoped>
  .account-page {
    :deep(.user) {
      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 6px;
      }

      > div {
        margin-left: 10px;

        .user-name {
          font-weight: 500;
          color: var(--art-text-gray-800);
        }
      }
    }
  }
</style>
