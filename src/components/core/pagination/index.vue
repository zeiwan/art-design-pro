<template>
  <div class="pagination">
    <ElPagination
      v-bind="props"
      :pager-count="isMobile ? 5 : 7"
      v-model:currentPage="pager.page"
      v-model:pageSize="pager.size"
      :page-sizes="pageSizes"
      :layout="paginationLayoutComputed"
      :total="pager.count"
      :background="true"
      :hide-on-single-page="false"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
  </div>
</template>

<script lang="ts" setup>
  const { width } = useWindowSize()
  const isMobile = computed(() => width.value < 500)

  interface Props {
    modelValue?: Record<string, any>
    pageSizes?: number[]
    layout?: string
  }
  const props = withDefaults(defineProps<Props>(), {
    modelValue: () => ({}),
    pageSizes: () => [10, 20, 30, 40],
    layout: ''
  })

  const emit = defineEmits<{
    (event: 'change'): void
    (event: 'update:modelValue', value: any): void
  }>()

  const pager = computed({
    get() {
      return props.modelValue
    },
    set(value) {
      emit('update:modelValue', value)
    }
  })
  const sizeChange = () => {
    pager.value.page = 1
    emit('change')
  }
  const pageChange = () => {
    emit('change')
  }
  const paginationLayoutComputed = computed(() => {
    if (props.layout) {
      return props.layout
    }
    return isMobile.value
      ? 'prev, pager, next, jumper, sizes, total'
      : 'total, sizes, prev, pager, next, jumper'
  })
</script>
