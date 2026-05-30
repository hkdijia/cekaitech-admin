import type { Component } from 'vue';
import {
  CollectionTag,
  Document,
  DocumentChecked,
  FolderChecked,
  List,
  MagicStick,
  Management,
  Message,
  Money,
  More,
  OfficeBuilding,
  Search,
  Service
} from '@element-plus/icons-vue';

export interface MiniappIconOption {
  key: string;
  label: string;
  scene: string;
  component: Component;
}

export const MINIAPP_ICON_OPTIONS: MiniappIconOption[] = [
  { key: 'calculator', label: '计算器', component: MagicStick, scene: '计算工具' },
  { key: 'scale', label: '天平', component: Money, scene: '费用与规则' },
  { key: 'clipboard-list', label: '表单清单', component: List, scene: '流程清单' },
  { key: 'landmark', label: '机构', component: OfficeBuilding, scene: '法院与机构' },
  { key: 'hand-heart', label: '援助', component: Service, scene: '公益支持' },
  { key: 'file-text', label: '文书', component: Document, scene: '文书生成' },
  { key: 'shield-check', label: '复核', component: DocumentChecked, scene: '审核校验' },
  { key: 'folder-check', label: '材料整理', component: FolderChecked, scene: '材料归集' },
  { key: 'search-check', label: '查询', component: Search, scene: '检索核对' },
  { key: 'message-square', label: '咨询', component: Message, scene: '沟通咨询' },
  { key: 'notice', label: '公告', component: CollectionTag, scene: '公告通知' },
  { key: 'management', label: '管理', component: Management, scene: '后台管理' },
  { key: 'more-horizontal', label: '更多', component: More, scene: '更多入口' }
];

export function findMiniappIconOption(iconKey: string) {
  return MINIAPP_ICON_OPTIONS.find((item) => item.key === iconKey);
}
