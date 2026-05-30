<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { Refresh, View, Check } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import {
  getPrivateLendingResultTemplate,
  previewPrivateLendingResultTemplate,
  savePrivateLendingResultTemplate,
  type PrivateLendingDocPackage,
  type PrivateLendingResultTemplate
} from '../../api/privateLendingResultTemplate';
import { useAuthStore } from '../../stores/auth';

const APP_CODE = 'lawsuit-material-assistant';
const CASE_TYPE = 'private_lending';

const auth = useAuthStore();
const loading = ref(false);
const submitting = ref(false);
const previewing = ref(false);
const loadError = ref('');
const schemaVersion = ref(1);
const previewPackage = ref<PrivateLendingDocPackage | null>(null);

const templateForm = reactive<PrivateLendingResultTemplate>({
  draftTitle: '',
  riskNotice: '',
  filingGuideUrl: '',
  filingGuideLabel: '',
  evidenceChecklist: [],
  filingTips: [],
  draftLines: []
});

const sampleFormData = reactive<Record<string, string>>({
  borrowerName: '张三',
  lenderName: '李四',
  principalAmount: '50000',
  loanDate: '2026-05-01',
  repaymentDate: '2026-06-01',
  deliveryMethod: 'bank_transfer',
  interestClaim: '按约定利息主张，具体以法院依法认定为准',
  hasWrittenIOU: 'yes',
  hasPaymentProof: 'yes',
  borrowerIdKnown: 'no',
  caseFacts: '多次催要未还。'
});

const evidenceText = computed({
  get: () => templateForm.evidenceChecklist.join('\n'),
  set: (value: string) => {
    templateForm.evidenceChecklist = splitLines(value);
  }
});

const filingTipsText = computed({
  get: () => templateForm.filingTips.join('\n'),
  set: (value: string) => {
    templateForm.filingTips = splitLines(value);
  }
});

const draftLinesText = computed({
  get: () => templateForm.draftLines.join('\n'),
  set: (value: string) => {
    templateForm.draftLines = value.split(/\r?\n/);
  }
});

const canManageTemplate = computed(() => auth.hasPermission('admin:private-lending-result-template:manage'));

function splitLines(value: string) {
  return value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
}

function assignTemplate(template: PrivateLendingResultTemplate) {
  templateForm.draftTitle = template.draftTitle || '';
  templateForm.riskNotice = template.riskNotice || '';
  templateForm.filingGuideUrl = template.filingGuideUrl || '';
  templateForm.filingGuideLabel = template.filingGuideLabel || '';
  templateForm.evidenceChecklist = [...(template.evidenceChecklist || [])];
  templateForm.filingTips = [...(template.filingTips || [])];
  templateForm.draftLines = [...(template.draftLines || [])];
}

function payloadTemplate(): PrivateLendingResultTemplate {
  return {
    draftTitle: templateForm.draftTitle,
    riskNotice: templateForm.riskNotice,
    filingGuideUrl: templateForm.filingGuideUrl,
    filingGuideLabel: templateForm.filingGuideLabel,
    evidenceChecklist: [...templateForm.evidenceChecklist],
    filingTips: [...templateForm.filingTips],
    draftLines: [...templateForm.draftLines]
  };
}

async function loadTemplate() {
  loading.value = true;
  loadError.value = '';
  try {
    const result = await getPrivateLendingResultTemplate(APP_CODE, CASE_TYPE);
    schemaVersion.value = result.schemaVersion;
    assignTemplate(result.template);
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '结果模板加载失败';
  } finally {
    loading.value = false;
  }
}

async function saveTemplate() {
  submitting.value = true;
  loadError.value = '';
  try {
    const result = await savePrivateLendingResultTemplate({
      appCode: APP_CODE,
      caseType: CASE_TYPE,
      template: payloadTemplate()
    });
    schemaVersion.value = result.schemaVersion;
    assignTemplate(result.template);
    ElMessage.success('结果模板已保存');
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '结果模板保存失败';
  } finally {
    submitting.value = false;
  }
}

async function previewTemplate() {
  previewing.value = true;
  loadError.value = '';
  try {
    const result = await previewPrivateLendingResultTemplate({
      appCode: APP_CODE,
      caseType: CASE_TYPE,
      sampleFormData: { ...sampleFormData }
    });
    previewPackage.value = result.docPackage;
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '结果模板预览失败';
  } finally {
    previewing.value = false;
  }
}

onMounted(loadTemplate);
</script>

<template>
  <section>
    <h1 class="page-title">民间借贷结果模板</h1>
    <p class="page-subtitle">维护后端结构化结果模板，预览内容与小程序生成接口保持同一套确定性组装逻辑。</p>

    <el-alert v-if="loadError" class="error-alert" type="error" :title="loadError" show-icon />

    <div class="template-layout">
      <el-card v-loading="loading" shadow="never" class="template-panel">
        <div class="toolbar">
          <div>
            <div class="toolbar-title">模板字段</div>
            <div class="toolbar-subtitle">Schema v{{ schemaVersion }}，支持固定占位符，不支持页面代码。</div>
          </div>
          <div class="toolbar-actions">
            <el-button :icon="Refresh" @click="loadTemplate">刷新</el-button>
            <el-button type="primary" :icon="View" :loading="previewing" @click="previewTemplate">预览结果</el-button>
            <el-button
              v-if="canManageTemplate"
              type="success"
              :icon="Check"
              :loading="submitting"
              @click="saveTemplate"
            >
              保存模板
            </el-button>
          </div>
        </div>

        <el-form label-width="112px">
          <el-form-item label="草稿标题"><el-input v-model="templateForm.draftTitle" /></el-form-item>
          <el-form-item label="风险提示"><el-input v-model="templateForm.riskNotice" type="textarea" :rows="3" /></el-form-item>
          <el-form-item label="服务路径"><el-input v-model="templateForm.filingGuideUrl" /></el-form-item>
          <el-form-item label="服务文案"><el-input v-model="templateForm.filingGuideLabel" /></el-form-item>
          <el-form-item label="证据清单">
            <el-input v-model="evidenceText" type="textarea" :rows="4" />
          </el-form-item>
          <el-form-item label="立案提示">
            <el-input v-model="filingTipsText" type="textarea" :rows="4" />
          </el-form-item>
          <el-form-item label="草稿正文">
            <el-input v-model="draftLinesText" type="textarea" :rows="12" />
          </el-form-item>
        </el-form>
      </el-card>

      <el-card shadow="never" class="preview-panel">
        <div class="toolbar-title">预览结果</div>
        <el-empty v-if="!previewPackage" description="点击预览结果生成样例" />
        <div v-else class="preview-content">
          <h2>{{ previewPackage.draftTitle }}</h2>
          <pre>{{ previewPackage.draftContent }}</pre>
          <h3>证据清单</h3>
          <ul><li v-for="item in previewPackage.evidenceChecklist" :key="item">{{ item }}</li></ul>
          <h3>立案提示</h3>
          <ul><li v-for="item in previewPackage.filingTips" :key="item">{{ item }}</li></ul>
          <p class="risk">{{ previewPackage.riskNotice }}</p>
        </div>
      </el-card>
    </div>
  </section>
</template>

<style scoped>
.error-alert {
  margin-bottom: 16px;
}

.template-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(360px, 0.8fr);
  gap: 16px;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.toolbar-title {
  color: #344054;
  font-size: 15px;
  font-weight: 600;
}

.toolbar-subtitle {
  margin-top: 4px;
  color: #667085;
  font-size: 13px;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.preview-content h2,
.preview-content h3 {
  color: #344054;
}

.preview-content pre {
  max-height: 520px;
  overflow: auto;
  white-space: pre-wrap;
  line-height: 1.8;
  color: #1d2939;
  background: #f8fafc;
  border: 1px solid #eaecf0;
  border-radius: 6px;
  padding: 12px;
}

.risk {
  color: #7a2e0e;
  background: #fff7ed;
  border-radius: 6px;
  padding: 10px;
}

@media (max-width: 1080px) {
  .template-layout {
    grid-template-columns: 1fr;
  }
}
</style>
