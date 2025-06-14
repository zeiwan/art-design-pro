import type { FormRules } from 'element-plus'
// 初始搜索状态
export const initialSearchState = {
  userPhone: '',
  userName: '',
  userGender: '',
  status: '',
  userRoles: [],
  create_time_start: '',
  create_time_end: ''
}
// 初始规则状态
export const initialRulesState = reactive<FormRules>({
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  userPhone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ],
  userGender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  userRoles: [{ required: true, message: '请选择角色', trigger: 'change' }]
})
