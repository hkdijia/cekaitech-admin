<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const router = useRouter();
const auth = useAuthStore();

const form = reactive({
  username: 'admin',
  password: '123456'
});

const submitting = ref(false);

async function submit() {
  submitting.value = true;
  try {
    await auth.login(form.username, form.password);
    router.push('/dashboard');
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <main class="login-page">
    <section class="login-panel">
      <div>
        <h1>策凯科技管理后台</h1>
        <p>当前为开发占位登录，生产级鉴权后续接入 miniapp-backend。</p>
      </div>
      <el-form label-position="top" @submit.prevent="submit">
        <el-form-item label="账号">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" show-password />
        </el-form-item>
        <el-button type="primary" size="large" class="login-button" :loading="submitting" @click="submit">进入后台</el-button>
      </el-form>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eef2f6;
  padding: 24px;
}

.login-panel {
  width: min(420px, 100%);
  padding: 32px;
  background: #fff;
  border: 1px solid #e4e7ec;
  border-radius: 8px;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
}

h1 {
  margin: 0 0 8px;
  font-size: 26px;
}

p {
  margin: 0 0 24px;
  color: #667085;
  line-height: 1.6;
}

.login-button {
  width: 100%;
}
</style>
