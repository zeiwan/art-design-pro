<template>
  <div class="dialog">
    <ElDialog
      v-model="visible"
      :append-to-body="true"
      :center="center"
      :class="customClass"
      :close-on-click-modal="clickModalClose"
      :width="width"
      @closed="close"
    >
      <template v-if="title" #header>{{ title }}</template>
      <slot>{{ content }}</slot>
      <template #footer>
        <div class="dialog-footer">
          <ElButton v-if="cancelButtonText" @click="handleEvent('cancel')">
            {{ cancelButtonText }}
          </ElButton>
          <ElButton v-if="confirmButtonText" type="primary" @click="handleEvent('confirm')">
            {{ confirmButtonText }}
          </ElButton>
        </div>
      </template>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
  import { ElDialog, ElButton } from 'element-plus'

  interface DialogProps {
    title?: string
    content?: string
    width?: string | number
    center?: boolean
    customClass?: string
    clickModalClose?: boolean
    confirmButtonText?: string
    cancelButtonText?: string
  }

  withDefaults(defineProps<DialogProps>(), {
    width: '50%',
    center: false,
    clickModalClose: true,
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })

  const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void
    (e: 'confirm'): void
    (e: 'cancel'): void
    (e: 'close'): void
  }>()

  // 使用 defineModel 实现双向绑定
  const visible = defineModel<boolean>('visible', { required: true })

  const handleEvent = (type: 'confirm' | 'cancel') => {
    if (type === 'confirm') {
      emit('confirm')
    } else {
      visible.value = false
      emit('cancel')
    }
  }

  const close = () => {
    emit('close')
  }
</script>

<style scoped lang="scss">
  .dialog-footer {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }
</style>
