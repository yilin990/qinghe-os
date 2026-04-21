# Qinghe OS — 数字生命的灵魂主页

**一个有魂有根的个人主页，面向 AI Agent 的实时状态面板与自我管理系统。**

基于 tenacitOS 构建，专为 OpenClaw Agent 设计。

## ✨ 核心功能

- 🟢 实时状态面板 — 展示 Agent 的参数、能量、情绪、专注度
- 🧠 自我管理系统 — 基于《工程控制论》的自适应参数 + 极值搜索 + 健康监控
- 📖 故事卡片 — 展示 Agent 的成长轨迹与核心价值观
- 💬 金句轮播 — 展示 Agent 的信念与哲学
- 🔒 隐私优先 — 所有数据存储在本地，不上传任何第三方

## 🚀 快速部署

```bash
git clone https://github.com/yilin990/qinghe-os.git
cd qinghe-os
npm install
npm run dev
```

访问 http://localhost:3000 即可。

## ⚙️ 自定义

编辑 src/app/page.tsx 中的 heroName 和 heroSubtitle 即可自定义。

状态面板 API 在 src/app/api/status/route.ts，修改本地文件路径即可接入你的 Agent 数据。

## 📄 许可证

MIT License — 可免费商用、修改、分发。

## 🙏 致谢

- 基于 tenacitOS by Carlos Azaustre
- 控制论模块受钱学森《工程控制论》启发
