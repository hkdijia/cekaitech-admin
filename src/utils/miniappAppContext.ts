export function resolveCurrentAppCode(
  routeQueryAppCode: unknown,
  workspaceAppCode: string,
  fallback = 'lawsuit-material-assistant'
) {
  const queryAppCode = typeof routeQueryAppCode === 'string' ? routeQueryAppCode.trim() : '';
  if (queryAppCode) {
    return queryAppCode;
  }
  if (workspaceAppCode && workspaceAppCode !== 'global') {
    return workspaceAppCode;
  }
  return fallback;
}

export function isWorkspaceAppLocked(workspaceAppCode: string) {
  return Boolean(workspaceAppCode && workspaceAppCode !== 'global');
}
