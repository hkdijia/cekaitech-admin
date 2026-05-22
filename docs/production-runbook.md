# Production Runbook

本文档记录 `cekaitech-admin` 首次部署到 `admin.cekaitech.cn` 的操作边界。管理后台是纯前端静态构建产物，只通过 `miniapp-backend` 的受控 API 读写业务数据。

## 1. 当前部署假设

- 云厂商：腾讯云
- 服务器：轻量应用服务器
- 系统：Ubuntu 24.04 LTS
- 后台域名：`admin.cekaitech.cn`
- API 域名：`api.cekaitech.cn`
- 静态托管：Nginx
- 构建工具：Vite

## 2. 生产环境变量

仓库内只提交模板：

- `.env.production.example`

部署前复制为 `.env.production` 或在 CI/CD 中注入：

```bash
VITE_API_BASE_URL=https://api.cekaitech.cn
```

注意：Vite 环境变量会在构建时写入前端产物，不能放任何 secret。

## 3. 构建

本机或构建机执行：

```powershell
npm.cmd install
npm.cmd run quality
npm.cmd run build
```

产物目录：

```text
dist/
```

## 4. 服务器目录

建议目录：

```bash
/var/www/cekaitech-admin/
```

将 `dist/` 内文件上传到该目录。

## 5. Nginx 配置

`admin.cekaitech.cn` 示例：

```nginx
server {
    listen 80;
    server_name admin.cekaitech.cn;
    root /var/www/cekaitech-admin;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

HTTPS 证书配置完成后，必须将 HTTP 跳转到 HTTPS。

## 6. 上线验证

浏览器访问：

```text
https://admin.cekaitech.cn
```

验证点：

- 登录页可打开。
- 使用生产后台管理员登录。
- 登录后工作区、用户管理、限制管理页面可访问。
- 非登录接口收到 HTTP 401 后会清理本地 token 并跳转登录页。

## 7. 安全边界

- `admin.cekaitech.cn` 是管理后台，不应在搜索引擎和官网中主动暴露入口。
- 上线早期建议在 Nginx 前增加 Basic Auth 或 IP 白名单。
- 生产管理员不能长期使用 `admin/123456`。
- 后台只调用 `https://api.cekaitech.cn`，不直连数据库。

## 8. 回滚

每次发布前保留上一版静态产物：

```bash
cp -r /var/www/cekaitech-admin /var/www/cekaitech-admin.previous
```

回滚：

```bash
rm -rf /var/www/cekaitech-admin
mv /var/www/cekaitech-admin.previous /var/www/cekaitech-admin
sudo nginx -t
sudo systemctl reload nginx
```

## 9. 待办

- 明确 `admin.cekaitech.cn` 是否公网开放。
- 增加临时 Basic Auth 或 IP 白名单。
- 与 `miniapp-backend` 的生产管理员密码修改能力配套。
- 后续补细粒度路由和按钮权限。
