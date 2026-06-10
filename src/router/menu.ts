export interface AdminMenuItem {
  path: string;
  title: string;
  description: string;
  permissionCode: string;
  scope?: 'global' | 'miniapp';
  workspaceCodes?: string[];
}

const legalWorkspaceCodes = ['legal-material-assistant'];

export const adminMenuItems: AdminMenuItem[] = [
  {
    path: '/dashboard',
    title: '平台工作台',
    description: '公司级待办、工作区接入和系统状态',
    permissionCode: 'admin:workspace:view',
    scope: 'global'
  },
  {
    path: '/users',
    title: '用户管理',
    description: '用户查询和用户详情占位',
    permissionCode: 'admin:user:view',
    scope: 'global'
  },
  {
    path: '/restrictions',
    title: '限制与黑名单',
    description: '用户限制、封禁和恢复入口',
    permissionCode: 'admin:user-restriction:view',
    scope: 'global'
  },
  {
    path: '/miniapp-workbench',
    title: '小程序工作台',
    description: '当前小程序的运行概览、启用准备和待处理事项',
    permissionCode: 'admin:workspace:view',
    scope: 'miniapp',
    workspaceCodes: legalWorkspaceCodes
  },
  {
    path: '/lawyer-audits',
    title: '律师认证审核',
    description: '资质审核和审核意见占位',
    permissionCode: 'admin:lawyer-audit:view',
    scope: 'miniapp',
    workspaceCodes: legalWorkspaceCodes
  },
  {
    path: '/legal-form-events',
    title: '法律表单事件',
    description: '法律表单填写事件和质量状态',
    permissionCode: 'admin:legal-form-event:view',
    scope: 'miniapp',
    workspaceCodes: legalWorkspaceCodes
  },
  {
    path: '/generation-records',
    title: '生成记录',
    description: '法律助手云端生成记录',
    permissionCode: 'admin:generation-record:view',
    scope: 'miniapp',
    workspaceCodes: legalWorkspaceCodes
  },
  {
    path: '/legal-service-requests',
    title: '服务请求',
    description: '人工服务请求处理',
    permissionCode: 'admin:legal-service-request:view',
    scope: 'miniapp',
    workspaceCodes: legalWorkspaceCodes
  },
  {
    path: '/miniapp-home-config',
    title: '首页配置',
    description: '小程序首页模块、功能入口和公告',
    permissionCode: 'admin:miniapp-home-config:view',
    scope: 'miniapp',
    workspaceCodes: legalWorkspaceCodes
  },
  {
    path: '/miniapp-orchestration',
    title: '页面菜单管理',
    description: '按页面、模块和功能入口编排对客展示',
    permissionCode: 'admin:miniapp-home-config:view',
    scope: 'miniapp',
    workspaceCodes: legalWorkspaceCodes
  },
  {
    path: '/miniapp-document-catalog',
    title: '文书目录配置',
    description: '起诉文书生成目录和页面指向',
    permissionCode: 'admin:miniapp-document-catalog:view',
    scope: 'miniapp',
    workspaceCodes: legalWorkspaceCodes
  },
  {
    path: '/legal-tool-center',
    title: '法律工具中心',
    description: '竞品工具能力库、展示分组和曝光入口',
    permissionCode: 'admin:legal-tool-center:view',
    scope: 'miniapp',
    workspaceCodes: legalWorkspaceCodes
  },
  {
    path: '/data-governance',
    title: '数据同步/发布',
    description: '同步批次、修订记录和 LPR JSON 发布',
    permissionCode: 'admin:data-governance:view',
    scope: 'miniapp',
    workspaceCodes: legalWorkspaceCodes
  },
  {
    path: '/private-lending-result-template',
    title: '结果模板配置',
    description: '民间借贷结果模板和预览',
    permissionCode: 'admin:private-lending-result-template:view',
    scope: 'miniapp',
    workspaceCodes: legalWorkspaceCodes
  },
  {
    path: '/user-operation-logs',
    title: '操作审计',
    description: '用户相关后台操作审计',
    permissionCode: 'admin:user-operation-log:view',
    scope: 'global'
  },
  {
    path: '/data-import',
    title: '数据导入',
    description: 'crawler 导出文件导入入口',
    permissionCode: 'admin:data-import:view',
    scope: 'global'
  },
  {
    path: '/settings',
    title: '系统设置',
    description: '应用、菜单和运行参数占位',
    permissionCode: 'admin:settings:view',
    scope: 'global'
  }
];

export function filterAdminMenuItems(
  hasPermission: (permissionCode: string) => boolean,
  workspaceCode = 'global'
): AdminMenuItem[] {
  const scope = workspaceCode === 'global' ? 'global' : 'miniapp';
  return adminMenuItems.filter((item) => {
    if (item.scope !== scope) {
      return false;
    }
    if (item.workspaceCodes && !item.workspaceCodes.includes(workspaceCode)) {
      return false;
    }
    return hasPermission(item.permissionCode);
  });
}
