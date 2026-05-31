<script setup lang="ts">
import { computed } from 'vue';
import { MINIAPP_ICON_OPTIONS } from '../../miniapp-icons/miniappIconCatalog';

const props = defineProps<{
  modelValue: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const currentIconText = computed(() => props.modelValue || '未选择');

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
      <span class="miniapp-icon-current">当前图标：{{ currentIconText }}</span>
    </div>
    <div class="miniapp-icon-grid">
      <button
        v-for="icon in MINIAPP_ICON_OPTIONS"
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

.miniapp-icon-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
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
</style>
