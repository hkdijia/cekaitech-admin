export interface AdminMenuItem {
  path: string;
  title: string;
  description: string;
  permissionCode: string;
}

export const adminMenuItems: AdminMenuItem[] = [
  {
    path: '/dashboard',
    title: '首页工作台',
    description: '待办、概览和系统状态',
    permissionCode: 'admin:workspace:view'
  },
  {
    path: '/users',
    title: '用户管理',
    description: '用户查询和用户详情占位',
    permissionCode: 'admin:user:view'
  },
  {
    path: '/restrictions',
    title: '限制与黑名单',
    description: '用户限制、封禁和恢复入口',
    permissionCode: 'admin:user-restriction:view'
  },
  {
    path: '/lawyer-audits',
    title: '律师认证审核',
    description: '资质审核和审核意见占位',
    permissionCode: 'admin:lawyer-audit:view'
  },
  {
    path: '/legal-form-events',
    title: '法律表单事件',
    description: '法律表单填写事件和质量状态',
    permissionCode: 'admin:legal-form-event:view'
  },
  {
    path: '/generation-records',
    title: '生成记录',
    description: '法律助手云端生成记录',
    permissionCode: 'admin:generation-record:view'
  },
  {
    path: '/legal-service-requests',
    title: '服务请求',
    description: '人工服务请求处理',
    permissionCode: 'admin:legal-service-request:view'
  },
  {
    path: '/miniapp-home-config',
    title: '首页配置',
    description: '小程序首页模块、功能入口和公告',
    permissionCode: 'admin:miniapp-home-config:view'
  },
  {
    path: '/miniapp-orchestration',
    title: '小程序配置中心',
    description: '按页面、模块和功能入口编排对客展示',
    permissionCode: 'admin:miniapp-home-config:view'
  },
  {
    path: '/miniapp-document-catalog',
    title: '文书目录配置',
    description: '起诉文书生成目录和页面指向',
    permissionCode: 'admin:miniapp-document-catalog:view'
  },
  {
    path: '/legal-tool-center',
    title: '法律工具中心',
    description: '竞品工具能力库、展示分组和曝光入口',
    permissionCode: 'admin:legal-tool-center:view'
  },
  {
    path: '/data-governance',
    title: '数据同步/发布',
    description: '同步批次、修订记录和 LPR JSON 发布',
    permissionCode: 'admin:data-governance:view'
  },
  {
    path: '/private-lending-result-template',
    title: '结果模板配置',
    description: '民间借贷结果模板和预览',
    permissionCode: 'admin:private-lending-result-template:view'
  },
  {
    path: '/user-operation-logs',
    title: '操作审计',
    description: '用户相关后台操作审计',
    permissionCode: 'admin:user-operation-log:view'
  },
  {
    path: '/data-import',
    title: '数据导入',
    description: 'crawler 导出文件导入入口',
    permissionCode: 'admin:data-import:view'
  },
  {
    path: '/settings',
    title: '系统设置',
    description: '应用、菜单和运行参数占位',
    permissionCode: 'admin:settings:view'
  }
];

export function filterAdminMenuItems(hasPermission: (permissionCode: string) => boolean): AdminMenuItem[] {
  return adminMenuItems.filter((item) => hasPermission(item.permissionCode));
}
