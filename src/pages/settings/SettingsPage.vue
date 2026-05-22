<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { Lock } from '@element-plus/icons-vue';
import { changeAdminPassword } from '../../api/adminAuth';
import { useAuthStore } from '../../stores/auth';

const router = useRouter();
const auth = useAuthStore();
const formRef = ref<FormInstance>();
const submitting = ref(false);

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const rules: FormRules = {
  oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 8, message: '新密码至少 8 位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的新密码不一致'));
          return;
        }
        callback();
      },
      trigger: 'blur'
    }
  ]
};

async function submitPasswordChange() {
  if (!formRef.value) {
    return;
  }
  await formRef.value.validate();
  submitting.value = true;
  try {
    await changeAdminPassword({ ...passwordForm });
    ElMessage.success('密码已更新，请重新登录');
    auth.logout();
    router.push('/login');
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <section class="settings-page">
    <h1 class="page-title">系统设置</h1>
    <p class="page-subtitle">管理后台运行参数和当前管理员安全设置。</p>

    <div class="settings-grid">
      <el-card shadow="never" class="settings-panel">
        <template #header>
          <div class="panel-title">
            <el-icon><Lock /></el-icon>
            <span>当前管理员密码</span>
          </div>
        </template>
        <el-form ref="formRef" :model="passwordForm" :rules="rules" label-width="96px" class="password-form">
          <el-form-item label="旧密码" prop="oldPassword">
            <el-input v-model="passwordForm.oldPassword" type="password" show-password autocomplete="current-password" />
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="passwordForm.newPassword" type="password" show-password autocomplete="new-password" />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input v-model="passwordForm.confirmPassword" type="password" show-password autocomplete="new-password" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="submitting" @click="submitPasswordChange">更新密码</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card shadow="never" class="settings-panel">
        <template #header>运行配置</template>
        <el-empty description="工作区、菜单和运行参数后续接入" />
      </el-card>
    </div>
  </section>
</template>

<style scoped>
.settings-grid {
  display: grid;
  grid-template-columns: minmax(360px, 520px) minmax(320px, 1fr);
  gap: 16px;
}

.settings-panel {
  border-radius: 8px;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #344054;
  font-weight: 600;
}

.password-form {
  max-width: 440px;
}

@media (max-width: 900px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
}
</style>
