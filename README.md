<p align="center">
  <img src="assets/ui/title_text.png" alt="直到大地变成一颗酸橙" width="420">
</p>

<h1 align="center">直到大地变成一颗酸橙 · 夏日明信片工坊</h1>

<p align="center">
  明日方舟 2026 夏活《信使的工作》主题粉丝向图片生成网页
  <br>
  上传你的照片，搭配安洁莉娜贴纸，生成专属夏日明信片
</p>

<p align="center">
  <img alt="纯静态" src="https://img.shields.io/badge/纯静态-零依赖-2ebdf8">
  <img alt="UI 复刻" src="https://img.shields.io/badge/UI-复刻官方活动页-e18d25">
  <img alt="部署" src="https://img.shields.io/badge/部署-Vercel%20%2F%20GitHub%20Pages-60b874">
</p>

---

## 功能一览

| 能力 | 说明 |
| --- | --- |
| 上传照片 | 文件选择 · 拖拽进画布 · Ctrl+V 粘贴 |
| 预设贴纸 | 活动标题 + 安洁莉娜 夏日装扮 / 飞行 / 喝奶茶 / 探头 |
| 自定义贴纸 | 上传任意 PNG 图片作为贴纸使用 |
| 自由编辑 | 拖动移动 · 手柄旋转缩放 · 滚轮缩放 · 方向键微调 |
| 图层控制 | 置顶 / 上移 / 下移 / 置底 · 复制 · 删除 |
| 画布背景 | 照片 / 奶油色 / 天蓝 / 白色 |
| 高清导出 | 最长边 1600px PNG · 微博 / QQ / 空间分享 |

## 快速开始

纯静态页面，无构建、无依赖，任意静态服务器即可运行：

```bash
npx serve .
# 或
python -m http.server 8080
```

访问 `http://localhost:8080`。

## 部署到 Vercel

1. 将本仓库推送到 GitHub
2. 打开 [vercel.com](https://vercel.com) → New Project → Import 本仓库
3. Framework Preset 选择 **Other**（无需构建命令、无需输出目录），直接 Deploy

或使用命令行：

```bash
npm i -g vercel
vercel --prod
```

## 部署到 GitHub Pages

1. 仓库 Settings → Pages → Source 选择 `Deploy from a branch`
2. 分支选 `main`，目录选 `/`（根目录）
3. 保存后访问 `https://<用户名>.github.io/<仓库名>/`

## 自定义贴纸

图片素材托管于 `https://ark-img.jinghuashang.cn`（本地原件在 `assets/png/`）。把贴纸上传到 CDN 的 `assets/bc/` 路径，然后在 `app.js` 的 `PRESETS` 数组加一行：

```js
{ src: 'https://ark-img.jinghuashang.cn/assets/bc/my-sticker.webp', name: '我的贴纸', scale: 60 },
```

`scale` 为添加时的默认大小（100 = 画布宽度的 42%）。

## 目录结构

```
├── index.html          页面结构（官方加载屏 + 主屏外壳 + 完成页）
├── style.css           样式（复刻官方 index.cd6a74.css，rem 缩放体系）
├── app.js              编辑引擎（纯原生 JS，零依赖）
├── DESIGN.md           官方页面设计系统分析（Google Stitch 格式）
├── assets/
│   ├── ui/             官方 UI 素材（背景 / 按钮 / 面板 / 图标 / 标题图）
│   ├── bc/             预设贴纸素材（安洁莉娜系列）
│   └── fonts/          官方字体子集（思源黑 / 宋 / 猫啃 / Luckiest Guy）
└── README.md           本文件
```

## 技术要点

- **缩放体系**：`html 字号 = min(视口宽/120, 视口高/67.5)`，全站 rem，背景铺满视口
- **字体**：思源宋 Heavy 按钮 / 思源黑 Heavy 标题 / 猫啃什锦黑进度条（OFL 许可，自托管）
- **动效**：标题入场右滑 + 无限摆动（官方 1800ms 交替）、按钮 hover 上浮、屏幕淡入切换
- **导出**：Canvas 合成，照片 + 贴纸按相对坐标渲染，最长边 1600px PNG

## 声明

本项目为粉丝向非官方页面，素材版权归鹰角网络（Hypergryph）所有，仅供个人娱乐与学习使用。
