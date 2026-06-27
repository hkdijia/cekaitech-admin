import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const contractPath = 'docs/store-appointment-white-label-pack-plan.md';

function readProjectFile(relativePath) {
  return readFileSync(resolve(projectRoot, relativePath), 'utf8');
}

function listChangedFiles() {
  const statusOutput = execFileSync('git', ['status', '--porcelain=v1', '-z'], {
    cwd: projectRoot,
    encoding: 'utf8'
  });
  if (!statusOutput) {
    return execFileSync('git', ['diff-tree', '--no-commit-id', '--name-only', '-r', 'HEAD'], {
      cwd: projectRoot,
      encoding: 'utf8'
    })
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => line.replaceAll('\\', '/'));
  }

  return statusOutput
    .split('\0')
    .map((line) => line.slice(3).trim())
    .filter(Boolean)
    .map((line) => line.replaceAll('\\', '/'));
}

describe('store appointment white label pack plan', () => {
  it('exists as a white label deployment planning asset only', () => {
    expect(existsSync(resolve(projectRoot, contractPath))).toBe(true);
  });

  it('defines white label branding and deployment boundaries without adding runtime implementation', () => {
    const content = readProjectFile(contractPath);
    const router = readProjectFile('src/router/index.ts');
    const layout = readProjectFile('src/layouts/AdminLayout.vue');

    expect(content).toContain('白标托管后台');
    expect(content).toContain('规划态');
    expect(content).toContain('品牌配置');
    expect(content).toContain('权限映射');
    expect(content).toContain('部署配置');
    expect(content).toContain('API base URL');
    expect(content).toContain('客户域名');
    expect(content).toContain('不新增运行时代码');
    expect(content).toContain('不新增路由');
    expect(router).not.toContain('white-label');
    expect(layout).not.toContain('白标托管后台');
  });

  it('keeps planning slices limited to documentation, tests, and checkpoint assets', () => {
    const changedFiles = listChangedFiles();

    expect(changedFiles.length).toBeGreaterThan(0);
    expect(changedFiles).not.toContain('dist/index.html');
    for (const file of changedFiles) {
      const isAllowedPlanningAsset =
        file === 'codex-handoff.md' ||
        file === 'tasks/current-task.md' ||
        file.startsWith('docs/') ||
        file.startsWith('scripts/');

      expect(isAllowedPlanningAsset).toBe(true);
      expect(file.startsWith('src/')).toBe(false);
      expect(file.startsWith('vite.config')).toBe(false);
      expect(file.startsWith('.env')).toBe(false);
    }
  });

  it('keeps store appointment pack portable without leaking internal demo assets or secrets', () => {
    const content = readProjectFile(contractPath);

    expect(content).toContain('后台名称');
    expect(content).toContain('Logo');
    expect(content).toContain('主题色');
    expect(content).toContain('员工称谓');
    expect(content).toContain('项目称谓');
    expect(content).toContain('门店称谓');
    expect(content).toContain('客户 secret');
    expect(content).toContain('商户密钥');
    expect(content).toContain('内部演示数据');
    expect(content).toContain('不能写入前端构建产物');
  });

  it('links the white label plan from pack index without binding future checkpoints to this task', () => {
    const packIndex = readProjectFile('docs/store-appointment-admin-pack-contract-index.md');

    expect(packIndex).toContain(contractPath);
    expect(packIndex).toContain('白标托管后台配置清单');
    expect(packIndex).toContain('Store Appointment Admin Pack');
  });
});
