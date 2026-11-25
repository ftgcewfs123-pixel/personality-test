# 生活氛围人格测试

一个小红书风格的性格测试单页。纯 HTML、CSS、JavaScript，没有后端，也不需要构建。用浏览器直接打开就能测，也可以发布到 GitHub Pages。

在线地址：<https://ftgcewfs123-pixel.github.io/personality-test/>

## 文件列表

| 文件 | 作用 |
| --- | --- |
| `index.html` | 页面骨架。首页、答题、结果都渲染在 `#view` 里，不刷新整页。 |
| `style.css` | 样式。圆角卡片、暖色渐变、移动端优先。 |
| `script.js` | 题目、结果、计分、复制分享、访问统计。换内容主要改这个文件。 |
| `README.md` | 本说明。 |
| `.nojekyll` | 空文件。告诉 GitHub Pages 不要用 Jekyll 处理站点。 |

样式和脚本使用相对路径，所以下面两种打开方式都可以：

- 直接双击或用浏览器打开 `index.html`
- 在本目录起一个本地静态服务器

## 本地预览

在 `personality-test` 目录里：

```bash
python -m http.server 8080
```

浏览器打开 <http://127.0.0.1:8080/> 。

如果在仓库根目录启动：

```bash
python -m http.server 8080
```

打开 <http://127.0.0.1:8080/personality-test/> （注意末尾的斜杠）。

直接打开本地文件时，地址是 `file://`。复制按钮会先尝试 Clipboard API；本地文件不算安全上下文，会自动改用 `document.execCommand("copy")`。两种方式失败都只会提示，不会让页面停住。

## 页面流程

1. **首页**：介绍和「开始测试」。
2. **答题**：一次一题，每题 4 个单选。顶部有进度，第一题之后可以点「上一题」。选中后会进入下一题。
3. **结果**：人格名称、一句短描述、倾向条，以及可复制的分享文案。「再测一次」会清空答案，从第一题重新开始。

分享文案里包含测出的人格，以及邀请朋友来测的句子和本站链接。

## 题目和结果的数据格式

数据都在 `script.js` 顶部。

### 题目 `QUESTIONS`

数组。每一项是一道题：

```js
{
  text: "题干",
  options: [
    { text: "选项文案", scores: { cozy: 2 } },
    { text: "选项文案", scores: { explore: 2 } },
    { text: "选项文案", scores: { plan: 2 } },
    { text: "选项文案", scores: { aesthetic: 2 } }
  ]
}
```

- `options` 固定写 4 个。页面按数组顺序标成 A / B / C / D。
- `scores` 的键是人格 `id`，值是加分（数字）。一个选项可以同时给几种人格加分，例如 `{ cozy: 2, aesthetic: 1 }`。
- 题量不写死。首页上的题数会跟着数组长度变。改完请保持每题都是 4 个选项。

### 结果 `RESULTS`

数组。建议 4 到 8 种。每一项：

```js
{
  id: "cozy",          // 与 scores 的键对应，不要重复
  short: "治愈",        // 结果页倾向条上的短名称
  emoji: "🍵",
  label: "治愈系生活家",
  tagline: "你把日子过成了温热的。",   // 可选，显示在名称下面
  description: "两三句描述。",
  shareText: "分享正文，链接位置写 {url}"
}
```

`shareText` 里的 `{url}` 会替换成文件顶部的 `SHARE_URL`。如果忘了写 `{url}`，复制时仍会在末尾补上邀请句子和链接。

### 怎么计分

答完后，把 12 道题所选选项的 `scores` 加总。取得分最高的那一项作为结果。

如果几种人格分数相同，`RESULTS` 里排在更前面的胜出。调整数组顺序就能改变并列时的优先级。

当前是 12 道题、6 种结果：治愈系生活家、氛围感收藏家、人间小太阳、城市探险家、独自发光体、清醒规划师。

## 怎么更换题目

1. 打开 `script.js`，改 `QUESTIONS`。可以整段替换，只要保留 `text` 和 4 个 `options`。
2. 如果新人格不只是改文案，就改 `RESULTS`：换 `id` 时，记得把题目里的 `scores` 键一起改掉。
3. 想改分享出去的网址，改 `SHARE_URL`。
4. 保存后刷新浏览器即可，没有构建步骤。

控制台会提示明显的数据问题（选项不是 4 个、`scores` 用了不存在的 `id`）。这些提示不会打断测试。

## 访问统计

统计是插拔的，坏了也不影响答题、出结果和复制。

### 本机计数（始终开启）

使用 `localStorage`，键名是 `STATS_CONFIG.storageKey`（默认 `personality-test-stats-v1`）。

- 每次打开页面，`visits` 加 1
- 每次答完进入结果页，`completions` 加 1

页脚显示「本机访问 N 次 · 完成测试 M 次」。这是这一台浏览器里的数字，不是全站人数。换浏览器、清站点数据或无痕模式都会重新计算。浏览器禁用本地存储时，计数会静默失败，页面继续可用。

### 外部统计（默认关闭）

把 `STATS_CONFIG.provider` 改成下面其中一个：

| 值 | 还要填什么 | 页面上能看到什么 |
| --- | --- | --- |
| `"none"` | 无 | 只有本机计数。默认就是这个。 |
| `"busuanzi"` | 一般不用改 `busuanzi.script` | 不蒜子返回后，页脚多一行「本站访问 X 次」。脚本失败时这一行保持隐藏。 |
| `"umami"` | `umami.src`、`umami.websiteId` | 数字在 Umami 后台，不显示在页面上。 |
| `"goatcounter"` | `goatcounter.src`，例如 `https://你的站点.goatcounter.com/count` | 数字在 GoatCounter 后台。 |
| `"ga"` | `ga.measurementId`，例如 `G-XXXX` | 数字在 Google Analytics 后台。 |

示例：

```js
const STATS_CONFIG = {
  provider: "busuanzi",
  storageKey: "personality-test-stats-v1",
  busuanzi: {
    script: "https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js",
  },
  // 其余配置可留空
};
```

不蒜子的脚本地址如果失效，只改 `busuanzi.script`，或把 `provider` 改回 `"none"`。

外部脚本都是动态插入，并带有 `onerror`。配置不完整、地址 404、被浏览器拦截，都只会在控制台留下警告。

### 自己的统计钩子

如果要接上面没有列出的服务，在 `script.js` 之前设置：

```html
<script>
  window.PERSONALITY_TEST_STATS_HOOK = function (payload) {
    // payload.event 为 "visit" 或 "complete"
    // payload.detail 为 { visits, completions }
  };
</script>
<script src="script.js"></script>
```

钩子抛错会被吃掉，测试流程不受影响。

## 部署到 GitHub Pages

站点地址形如 `https://<用户名>.github.io/personality-test/`。页面必须从 **`gh-pages` 分支的根目录**提供，也就是把 `personality-test/` 文件夹里的文件放到该分支根上，而不是再套一层目录。

仓库 `main` 分支保留源码和下面的工作流。推到 `main` 后，Actions 会把 `personality-test/` 的内容强制推到 `gh-pages`。

### 自动部署

工作流文件：`.github/workflows/deploy-pages.yml`。

- 触发：推送到 `main`，或在 Actions 页手动运行
- 权限：`contents: write`，用来推送 `gh-pages`
- 行为：复制 `personality-test/`（含 `.nojekyll`）到临时目录，提交后强制推送到 `gh-pages`

首次使用前，在 GitHub 上把 Pages 的来源选成 `gh-pages` 分支、目录选 `/ (root)`。见下一节。

### 手动部署

在仓库根目录执行：

```bash
git subtree push --prefix personality-test origin gh-pages
```

这会把 `personality-test/` 目录历史推到 `gh-pages`，站点文件位于该分支根目录。

如果远程 `gh-pages` 曾经被 Actions 强制推送过，历史对不上，`subtree push` 可能被拒绝。可以改用：

```bash
git subtree split --prefix personality-test -b gh-pages-split
git push origin gh-pages-split:gh-pages --force
git branch -D gh-pages-split
```

`--force` 只覆盖 `gh-pages` 上的站点文件，不要对 `main` 使用。

### 开启 GitHub Pages

仓库需要是公开的（免费账号的项目站点）。然后任选一种方式。

**网页：**

1. 打开仓库的 Settings → Pages。
2. Build and deployment 里，Source 选 **Deploy from a branch**。
3. Branch 选 **gh-pages**，文件夹选 **/ (root)**，保存。
4. 等一到几分钟，访问 <https://ftgcewfs123-pixel.github.io/personality-test/> 。

**API**（把分支先推上去再调用）：

```bash
gh api --method POST /repos/ftgcewfs123-pixel/personality-test/pages \
  -f "build_type=legacy" \
  -f "source[branch]=gh-pages" \
  -f "source[path]=/"
```

已经开过 Pages、只想改来源时，把 `POST` 换成 `PUT`。

没有仓库管理权限时，接口会返回 403。用上面的网页步骤，由有 Settings 权限的人保存一次即可。

## 绑定自定义域名

先让 `https://ftgcewfs123-pixel.github.io/personality-test/` 能打开，再绑自己的域名。GitHub 建议先在仓库里写上自定义域名，再去改 DNS，避免域名被别人占用。

本仓库的自动部署会用 `personality-test/` 的内容覆盖 `gh-pages`。如果只在网页上保存域名，GitHub 写到 `gh-pages` 根目录的 `CNAME` 会在下一次部署时被清掉。要把域名固定下来，请在 `personality-test/CNAME` 里放一行域名（不要加 `https://`），再推到 `main`。例如：

```text
test.example.com
```

### 在 GitHub 上保存

1. Settings → Pages → Custom domain，填域名，Save。
2. 等 DNS 检查通过。若页面提示要验证域名，按提示在 DNS 添加一条 TXT 记录（内容每次不同，以页面为准）。

### 子域名

例如 `test.example.com` 或 `www.example.com`：

| 类型 | 主机名 | 值 |
| --- | --- | --- |
| CNAME | `test`（或 `www`） | `ftgcewfs123-pixel.github.io` |

目标是用户的 `github.io` 域名，不要写成带仓库名的路径，也不要在末尾加网址路径。删掉同一主机名上冲突的 A、AAAA 或旧 CNAME。

### 根域名（apex）

例如 `example.com`。根域名通常不能做标准 CNAME，用 A 和 AAAA：

| 类型 | 主机名 | 值 |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |

如果 DNS 服务商支持 `ALIAS` 或 `ANAME`，也可以把 `@` 指到 `ftgcewfs123-pixel.github.io`，同时仍建议保留 A 记录。删掉域名商默认的停放页 A / AAAA 记录，否则证书和跳转都会失败。不要使用 `*.example.com` 这种通配记录。

检查：

```bash
dig example.com +noall +answer -t A
dig example.com +noall +answer -t AAAA
dig test.example.com +noall +answer -t CNAME
```

DNS 传播有时要几分钟，最长大约 24 小时。

## HTTPS

- `github.io` 地址默认就是 HTTPS。
- 自定义域名会由 GitHub 申请 Let’s Encrypt 证书。DNS 正确之后，通常几分钟到几小时，最长大约 24 小时。
- 证书签发成功后，Settings → Pages 里勾选 **Enforce HTTPS**。证书还没好时，这个选项可能是灰的，过一会儿刷新再看。
- 证书就绪前不要在域名商那边做强制 HTTPS 跳转，否则会短暂打不开。

## 常见问题

- 页面没有样式：确认是通过带末尾斜杠的目录地址打开，而不是把相对路径解析到了上一级。`index.html`、`style.css`、`script.js` 要在同一层。
- Actions 成功但网站仍是旧的：浏览器强刷，或等 CDN 一两分钟。
- 页脚数字不像「全网人数」：那是本机计数。全站数字需要把 `provider` 改成不蒜子或其他统计。
