<template>
  <div class="edit">
    <popup
      :title="popupTitle"
      :async="true"
      width="550px"
      @confirm="handleSubmit"
      @close="handleClose"
      v-model:visible="visible"
    >
      <ElForm ref="formRef" :model="formData" :rules="formRules" label-width="80px">
        <ElFormItem label="用户名" prop="userName">
          <ElInput v-model="formData.userName" />
        </ElFormItem>
        <ElFormItem label="手机号" prop="userPhone">
          <ElInput v-model="formData.userPhone" />
        </ElFormItem>
        <ElFormItem label="性别" prop="userGender">
          <ElSelect v-model="formData.userGender"
            >common.ts
            <ElOption label="男" value="男" />
            <ElOption label="女" value="女" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="角色" prop="role">
          <ElSelect v-model="formData.userRoles" multiple>
            <ElOption
              v-for="role in roleList"
              :key="role.roleCode"
              :value="role.roleCode"
              :label="role.roleName"
            />
          </ElSelect>
        </ElFormItem>
      </ElForm>
    </popup>
  </div>
</template>
<script setup lang="ts">
  import { initialRulesState, initialSearchState } from '@/views/system/user/common'
  import { ROLE_LIST_DATA } from '@/mock/temp/formData'
  import { FormInstance } from 'element-plus'
  import { reactive, ref, computed, shallowRef, defineEmits, defineExpose } from 'vue'

  const formData = reactive({ ...initialSearchState })
  const formRules = reactive({ ...initialRulesState })
  const emit = defineEmits(['success', 'close'])
  const mode = ref('add')
  const popupTitle = computed(() => {
    return mode.value == 'edit' ? '编辑管理员' : '新增管理员'
  })
  const visible = ref(false)
  const formRef = shallowRef<FormInstance>()
  const roleList = ref<any[]>([])

  const open = (type: string) => {
    mode.value = type
    visible.value = true
    roleList.value = ROLE_LIST_DATA
  }

  const handleSubmit = async () => {
    try {
      await formRef.value?.validate()
      ElMessage.success(mode.value === 'add' ? '添加成功' : '更新成功')
      emit('success')
      visible.value = false // 关闭弹窗
    } catch (error) {
      console.error('表单验证失败', error)
    }
  }

  const handleClose = () => {
    visible.value = false
    emit('close')
  }
  const setFormData = (data: any) => {
    Object.assign(formData, data)
  }
  defineExpose({
    open,
    setFormData
  })
</script>
<style scoped lang="scss"></style>
