# 生活氛围人格测试

小红书风格的单页性格测试。纯静态页面，没有后端，也没有构建步骤。

- 在线访问：<https://ftgcewfs123-pixel.github.io/personality-test/>
- 站点文件：[`personality-test/`](personality-test/)
- 使用、换题、统计和部署说明：[`personality-test/README.md`](personality-test/README.md)

本地预览：用浏览器直接打开 `personality-test/index.html`，或在该目录执行 `python -m http.server 8080`。

推送到 `main` 后，GitHub Actions 会把 `personality-test/` 发布到 `gh-pages` 分支的根目录。

如果线上地址还是 404：打开仓库 Settings → Pages，Source 选 **Deploy from a branch**，Branch 选 `gh-pages`，文件夹选 **/ (root)**，保存后再等一两分钟。当前令牌没有仓库管理权限，不能代替你点这一下。
