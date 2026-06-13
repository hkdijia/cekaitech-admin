<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { Refresh, View, Check } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import {
  getCaseResultTemplateOptions,
  getPrivateLendingResultTemplate,
  previewPrivateLendingResultTemplate,
  savePrivateLendingResultTemplate,
  type CaseResultTemplateOption,
  type PrivateLendingDraftBlock,
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
const caseOptions = ref<CaseResultTemplateOption[]>([]);
const selectedCaseType = ref(CASE_TYPE);

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

const sampleDataByCaseType: Record<string, Record<string, string>> = {
  private_lending: {
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
  },
  divorce: {
    plaintiffName: '王五',
    defendantName: '赵六',
    marriageDate: '2018-05-20',
    separationStatus: 'separated',
    divorceClaim: 'request_divorce',
    childArrangement: '婚生子由原告直接抚养，被告依法承担抚养费。',
    propertyAndDebt: '共同财产及债务请求依法分割和确认。',
    caseFacts: '双方长期分居，感情确已破裂，无法继续共同生活。',
    hasMarriageCertificate: 'yes',
    hasChildInfo: 'yes',
    hasPropertyClues: 'no'
  },
  labor: {
    employeeName: '孙七',
    employerName: '杭州某科技有限公司',
    employmentStartDate: '2023-03-01',
    employmentEndDate: '2026-05-31',
    employmentStatus: 'terminated',
    laborClaim: 'wage_and_compensation',
    claimAmount: '38000',
    monthlyWage: '12000',
    unpaidWagePeriod: '2026年3月至2026年5月',
    unpaidWageAmount: '18000',
    terminationReason: '公司单方解除且未说明合法依据',
    compensationAmount: '20000',
    doubleWagePeriod: '未主张',
    doubleWageAmount: '0',
    arbitrationStatus: 'award_or_rejection',
    caseFacts: '员工主张单位拖欠工资并违法解除劳动关系。',
    hasLaborContract: 'yes',
    hasWageProof: 'yes',
    hasTerminationNotice: 'no'
  }
};

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
const selectedOption = computed(() => caseOptions.value.find((item) => item.caseType === selectedCaseType.value) || null);
const canEditSelectedTemplate = computed(() => selectedOption.value?.templateSupported === true);
const previewDraftLines = computed(() => {
  const draftBlocks = formatDraftBlocks(previewPackage.value?.draftBlocks || []);
  if (draftBlocks.length) {
    return draftBlocks;
  }
  return formatDraftContent(previewPackage.value?.draftContent || '');
});

type DraftLineType = 'title' | 'heading' | 'paragraph' | 'salutation' | 'court' | 'signature';

interface DraftLine {
  text: string;
  type: DraftLineType;
}

function splitLines(value: string) {
  return value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
}

function formatDraftContent(content: string): DraftLine[] {
  const lines = splitLines(content);
  return lines.map((line, index) => {
    if (index === 0 && /起诉状$/.test(line)) {
      return { text: line, type: 'title' };
    }
    if (/^此致$/.test(line)) {
      return { text: line, type: 'salutation' };
    }
    if (/人民法院$/.test(line) || /^此致$/.test(lines[index - 1] || '')) {
      return { text: line, type: 'court' };
    }
    if (/^(具状人|起诉人|申请人|日期)[：:]/.test(line)) {
      return { text: line, type: 'signature' };
    }
    if (/^[一二三四五六七八九十]+[、.．]|：$|:$/.test(line)) {
      return { text: line, type: 'heading' };
    }
    return { text: line, type: 'paragraph' };
  });
}

function normalizeDraftLineType(type: string): DraftLineType {
  if (type === 'section_heading') {
    return 'heading';
  }
  if (['title', 'heading', 'paragraph', 'salutation', 'court', 'signature'].includes(type)) {
    return type as DraftLineType;
  }
  return 'paragraph';
}

function formatDraftBlocks(blocks: PrivateLendingDraftBlock[]): DraftLine[] {
  return blocks
    .map((block) => {
      const text = (block.text || '').trim();
      if (!text) {
        return null;
      }
      return {
        text,
        type: normalizeDraftLineType(block.type || '')
      };
    })
    .filter((line): line is DraftLine => Boolean(line));
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

function assignSampleData(caseType: string) {
  const nextSampleData = sampleDataByCaseType[caseType] || sampleDataByCaseType.private_lending;
  for (const key of Object.keys(sampleFormData)) {
    delete sampleFormData[key];
  }
  Object.assign(sampleFormData, nextSampleData);
}

async function loadTemplate() {
  loading.value = true;
  loadError.value = '';
  try {
    const result = await getPrivateLendingResultTemplate(APP_CODE, selectedCaseType.value);
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
      caseType: selectedCaseType.value,
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
      caseType: selectedCaseType.value,
      sampleFormData: { ...sampleFormData }
    });
    previewPackage.value = result.docPackage;
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '结果模板预览失败';
  } finally {
    previewing.value = false;
  }
}

async function selectCaseType(caseType: string) {
  selectedCaseType.value = caseType;
  previewPackage.value = null;
  loadError.value = '';
  assignSampleData(caseType);
  if (!canEditSelectedTemplate.value) {
    return;
  }
  await loadTemplate();
}

async function loadOptions() {
  loading.value = true;
  loadError.value = '';
  try {
    caseOptions.value = await getCaseResultTemplateOptions(APP_CODE);
    const firstSupported = caseOptions.value.find((item) => item.templateSupported);
    selectedCaseType.value = firstSupported?.caseType || caseOptions.value[0]?.caseType || CASE_TYPE;
    assignSampleData(selectedCaseType.value);
    if (firstSupported) {
      await loadTemplate();
    }
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : '结果模板加载失败';
  } finally {
    loading.value = false;
  }
}

onMounted(loadOptions);
</script>

<template>
  <section>
    <h1 class="page-title">结果模板配置</h1>
    <p class="page-subtitle">按起诉文书目录选择案件类型，维护已具备生成配置的结构化结果模板。</p>

    <el-alert v-if="loadError" class="error-alert" type="error" :title="loadError" show-icon />

    <el-card shadow="never" class="case-panel">
      <div class="case-list">
        <button
          v-for="option in caseOptions"
          :key="option.caseType"
          type="button"
          class="case-option"
          :class="{ active: option.caseType === selectedCaseType, disabled: !option.templateSupported }"
          @click="selectCaseType(option.caseType)"
        >
          <span class="case-title">{{ option.title }}</span>
          <span class="case-status">{{ option.statusText }}</span>
        </button>
      </div>
    </el-card>

    <el-alert
      v-if="selectedOption && !canEditSelectedTemplate"
      class="error-alert"
      type="warning"
      :title="`${selectedOption.title}：${selectedOption.statusText}`"
      description="该案件类型目前只在文书目录中占位，尚未配置生成 schema 和结果模板，暂不开放编辑和预览。"
      show-icon
    />

    <div v-if="canEditSelectedTemplate" class="template-layout">
      <el-card v-loading="loading" shadow="never" class="template-panel">
        <div class="toolbar">
          <div>
            <div class="toolbar-title">{{ selectedOption?.title || '模板字段' }}</div>
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
          <div class="document-paper">
            <div
              v-for="(line, index) in previewDraftLines"
              :key="`${index}-${line.text}`"
              class="document-line"
              :class="`document-line-${line.type}`"
            >
              {{ line.text }}
            </div>
          </div>
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

.case-panel {
  margin-bottom: 16px;
}

.case-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.case-option {
  min-width: 156px;
  padding: 10px 12px;
  text-align: left;
  border: 1px solid #d0d5dd;
  border-radius: 6px;
  background: #ffffff;
  cursor: pointer;
}

.case-option.active {
  border-color: #1570ef;
  box-shadow: 0 0 0 2px rgba(21, 112, 239, 0.12);
}

.case-option.disabled {
  background: #f8fafc;
  color: #667085;
}

.case-title,
.case-status {
  display: block;
}

.case-title {
  color: #344054;
  font-size: 14px;
  font-weight: 600;
}

.case-status {
  margin-top: 4px;
  color: #667085;
  font-size: 12px;
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

.document-paper {
  max-height: 520px;
  overflow: auto;
  color: #1d2939;
  background: #ffffff;
  border: 1px solid #eaecf0;
  border-radius: 6px;
  padding: 28px 32px;
}

.document-line {
  color: #1d2939;
  font-size: 15px;
  line-height: 2;
  word-break: break-word;
}

.document-line-title {
  color: #101828;
  font-size: 22px;
  font-weight: 700;
  line-height: 2.1;
  text-align: center;
}

.document-line-heading {
  margin-top: 10px;
  color: #101828;
  font-weight: 700;
}

.document-line-paragraph {
  text-indent: 2em;
}

.document-line-salutation {
  margin-top: 12px;
}

.document-line-court {
  text-indent: 2em;
}

.document-line-signature {
  text-align: right;
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
