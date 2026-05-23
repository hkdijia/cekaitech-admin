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
