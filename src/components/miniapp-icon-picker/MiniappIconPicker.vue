<script setup lang="ts">
import { computed, ref } from 'vue';
import { MINIAPP_ICON_OPTIONS } from '../../miniapp-icons/miniappIconCatalog';

const props = defineProps<{
  modelValue: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const searchKeyword = ref('');

const currentIconText = computed(() => props.modelValue || '未选择');
const filteredIconOptions = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase();
  if (!keyword) {
    return MINIAPP_ICON_OPTIONS;
  }
  return MINIAPP_ICON_OPTIONS.filter((icon) => {
    return [icon.key, icon.label, icon.scene].some((value) => value.toLowerCase().includes(keyword));
  });
});

function selectIcon(iconKey: string) {
  if (props.disabled) {
    return;
  }
  emit('update:modelValue', iconKey);
}
</script>

<template>
  <div class="miniapp-icon-picker">
    <div class="miniapp-icon-picker-head">
      <span>统一开源图标库</span>
      <span class="miniapp-icon-count">图标库 50+</span>
      <span class="miniapp-icon-current">当前图标：{{ currentIconText }}</span>
    </div>
    <input
      v-model="searchKeyword"
      class="miniapp-icon-search"
      data-test="miniapp-icon-search"
      placeholder="搜索图标、场景或语义 key"
      type="search"
    >
    <div class="miniapp-icon-grid">
      <button
        v-for="icon in filteredIconOptions"
        :key="icon.key"
        class="miniapp-icon-choice"
        :class="{ active: modelValue === icon.key }"
        type="button"
        :disabled="disabled"
        :data-test="`miniapp-icon-${icon.key}`"
        @click="selectIcon(icon.key)"
      >
        <span class="miniapp-icon-symbol">
          <el-icon>
            <component :is="icon.component" />
          </el-icon>
        </span>
        <span class="miniapp-icon-name">{{ icon.label }}</span>
        <span class="miniapp-icon-scene">{{ icon.scene }}</span>
      </button>
    </div>
    <div v-if="filteredIconOptions.length === 0" class="miniapp-icon-empty">没有匹配的图标</div>
  </div>
</template>

<style scoped>
.miniapp-icon-picker {
  width: 100%;
}

.miniapp-icon-picker-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
  color: #344054;
  font-size: 13px;
  font-weight: 600;
}

.miniapp-icon-current {
  color: #667085;
  font-weight: 500;
}

.miniapp-icon-count {
  padding: 2px 8px;
  border-radius: 999px;
  background: #eef7f5;
  color: #0f766e;
  font-size: 12px;
  font-weight: 700;
}

.miniapp-icon-search {
  box-sizing: border-box;
  width: 100%;
  height: 34px;
  margin-bottom: 10px;
  padding: 0 11px;
  border: 1px solid #d0d5dd;
  border-radius: 8px;
  outline: none;
  color: #344054;
  font-size: 13px;
}

.miniapp-icon-search:focus {
  border-color: #0f766e;
  box-shadow: 0 0 0 2px rgba(15, 118, 110, 0.1);
}

.miniapp-icon-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  max-height: 340px;
  overflow: auto;
  padding-right: 2px;
}

.miniapp-icon-choice {
  display: grid;
  grid-template-columns: 30px 1fr;
  grid-template-rows: auto auto;
  align-items: center;
  min-height: 62px;
  padding: 8px;
  border: 1px solid #d0d5dd;
  border-radius: 8px;
  background: #ffffff;
  color: #344054;
  cursor: pointer;
  text-align: left;
}

.miniapp-icon-choice.active {
  border-color: #1e3a8a;
  background: #f1f5ff;
  color: #1e3a8a;
}

.miniapp-icon-choice:disabled {
  cursor: not-allowed;
  opacity: 0.72;
}

.miniapp-icon-symbol {
  grid-row: span 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 6px;
  background: #eef7f5;
  color: #0f766e;
  font-size: 16px;
}

.miniapp-icon-name {
  overflow: hidden;
  font-size: 13px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.miniapp-icon-scene {
  overflow: hidden;
  color: #667085;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.miniapp-icon-empty {
  padding: 14px 0 2px;
  color: #667085;
  font-size: 13px;
  text-align: center;
}
</style>
