# 林默 · 个人博客

一个无需构建工具的静态个人博客，适合直接部署到 GitHub Pages。

## 本地预览

在项目目录运行：

```bash
python -m http.server 8000
```

然后打开 `http://localhost:8000`。

## 发布到 GitHub Pages

1. 在 GitHub 创建仓库（个人主页仓库必须命名为 `KYCHELP.GITHUB.IO`，GitHub 会将它发布为 `https://kychelp.github.io/`）。
2. 上传 `index.html`、`styles.css` 和本 README。
3. 进入 **Settings → Pages**，选择 `Deploy from a branch`，分支选 `main`、目录选 `/ (root)`。
4. 保存后等待部署，访问 `https://kychelp.github.io/`。

文章卡片可以继续替换为真实文章链接和内容。


