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

当前服务器目录：

```bash
/data/cekaitech-admin/
```

将 `dist/` 内文件上传到该目录。

可在本机执行脚本完成构建、上传和远端覆盖同步：

```powershell
powershell -ExecutionPolicy Bypass -File scripts\deploy-admin-static.ps1
```

脚本会执行 `npm.cmd run build`，将 `dist/` 打成临时 `tar.gz` 包，通过 SSH key 上传到服务器临时目录，远端解包后自动备份当前 `/data/cekaitech-admin/` 为 `/data/cekaitech-admin.previous`，再用 `rsync --delete` 同步到 `/data/cekaitech-admin/`。

只检查构建和参数、不上传：

```powershell
powershell -ExecutionPolicy Bypass -File scripts\deploy-admin-static.ps1 -DryRun
```

## 5. Nginx 配置

`admin.cekaitech.cn` 示例：

```nginx
server {
    listen 80;
    server_name admin.cekaitech.cn;
    root /data/cekaitech-admin;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

HTTPS 证书配置完成后，必须将 HTTP 跳转到 HTTPS。

## 6. 试运行上线前必做

本阶段 `admin.cekaitech.cn` 是内部试运行后台，不按公开产品入口处理。上线前必须完成以下检查。

### 6.1 启用 Nginx Basic Auth

安装 `htpasswd` 工具：

```bash
sudo apt update
sudo apt install -y apache2-utils
```

创建 Basic Auth 账号。账号名可使用内部约定名称，密码不要写入 Git：

```bash
sudo htpasswd -c /etc/nginx/.htpasswd-cekaitech-admin admin_gate
sudo chmod 640 /etc/nginx/.htpasswd-cekaitech-admin
sudo chown root:www-data /etc/nginx/.htpasswd-cekaitech-admin
```

在 `admin.cekaitech.cn` 的 `server` 或 `location /` 中增加：

```nginx
auth_basic "Cekaitech Admin Trial";
auth_basic_user_file /etc/nginx/.htpasswd-cekaitech-admin;
```

完整 `location /` 示例：

```nginx
location / {
    auth_basic "Cekaitech Admin Trial";
    auth_basic_user_file /etc/nginx/.htpasswd-cekaitech-admin;
    try_files $uri $uri/ /index.html;
}
```

检查并重载：

```bash
sudo nginx -t
sudo systemctl reload nginx
```

验证点：

- 未输入 Basic Auth 账号密码时，浏览器不能直接进入登录页。
- 输入 Basic Auth 后，才显示管理后台自身登录页。
- Basic Auth 密码和后台管理员密码必须不同。

### 6.2 修改生产后台管理员默认密码

生产后台不能长期使用 `admin/123456` 或其他初始化默认密码。

首次登录后立即进入：

```text
系统设置 -> 修改密码
```

验证点：

- 修改密码成功后会清理本地 token 并回到登录页。
- 旧密码不能再次登录。
- 新密码能正常登录。

### 6.3 确认生产 API 域名

生产构建必须使用：

```bash
VITE_API_BASE_URL=https://api.cekaitech.cn
```

验证点：

- 浏览器 Network 中后台接口请求应访问 `https://api.cekaitech.cn/api/admin/...`。
- 不能访问 `127.0.0.1`、内网 IP 或本地 Vite `/api` 代理。
- `api.cekaitech.cn` 已配置 HTTPS，并且后端 CORS/反向代理允许 `admin.cekaitech.cn` 调用。

### 6.4 确认平台后台和小程序工作区隔离

管理后台是公司级平台后台，不是阳光法律助手单项目后台。

验证点：

- 左上角品牌展示为“策凯科技 / 平台管理后台”。
- 首页为“平台工作台”，用于查看公司级待办、工作区接入和系统状态。
- 全局后台工作区不展示阳光法律助手专属菜单。
- 切换到阳光法律助手工作区后，才展示该工作区由后端返回的菜单。
- 管理端仍只通过 `miniapp-backend` 受控 API 读写数据，不直连数据库，不控制 crawler 进程。

## 7. 上线验证

浏览器访问：

```text
https://admin.cekaitech.cn
```

验证点：

- 登录页可打开。
- 使用生产后台管理员登录。
- 首页试运行提醒可见。
- 登录后工作区、用户管理、限制管理页面可访问。
- 工作区切换后菜单隔离符合预期。
- 非登录接口收到 HTTP 401 后会清理本地 token 并跳转登录页。

## 8. 安全边界

- `admin.cekaitech.cn` 是管理后台，不应在搜索引擎和官网中主动暴露入口。
- 上线试运行期必须在 Nginx 前增加 Basic Auth；如后续有固定办公网络，再评估叠加 IP 白名单。
- 生产管理员不能长期使用 `admin/123456`。
- 后台只调用 `https://api.cekaitech.cn`，不直连数据库。
- Basic Auth 密码、生产后台管理员密码、数据库密码和 JWT secret 均不得提交到 Git。

## 9. 回滚

每次发布前保留上一版静态产物：

```bash
cp -r /data/cekaitech-admin /data/cekaitech-admin.previous
```

使用 `scripts/deploy-admin-static.ps1` 发布时，脚本会自动执行上一版备份。

回滚：

```bash
rm -rf /data/cekaitech-admin
mv /data/cekaitech-admin.previous /data/cekaitech-admin
sudo nginx -t
sudo systemctl reload nginx
```

## 10. 待办

- 后续补细粒度路由和按钮权限。
- 后续按真实组织和角色模型增强工作区权限配置。
