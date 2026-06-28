export interface AdminMenuItem {
  path: string;
  title: string;
  description: string;
  permissionCode: string;
  scope?: 'global' | 'miniapp';
}

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
    path: '/order-operations',
    title: '订单与退款',
    description: '跨小程序订单、退款和通知排障',
    permissionCode: 'admin:order:view',
    scope: 'global'
  },
  {
    path: '/store-appointments',
    title: '门店预约',
    description: '多行业门店预约列表和预约详情',
    permissionCode: 'admin:store-appointment:view',
    scope: 'global'
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
    return hasPermission(item.permissionCode);
  });
}
