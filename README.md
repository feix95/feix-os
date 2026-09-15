# FEIX.OS — feix 的个人站

> 写代码，也画猛男。

个人网站:独立开发者 × 插画师。展示代表作 [CodeAtlas](https://github.com/feix95/code-atlas)(AI 代码地图)与高饱和猛男同人插画。

**线上地址**:https://feix.zomfeix.com

## 技术栈

- [Astro](https://astro.build) 静态站 · 零 JS 框架负担
- [GSAP](https://gsap.com) + ScrollTrigger —— BOOT 自检、横向作品长廊、滚动章节动效
- 设计语言:Marathon 机能 × LDR 片头 —— 酸绿 `#C8FF2E` × 纯黑 × 高饱和撞色
- 部署:Cloudflare Pages(直传)

## 本地开发

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # 产物在 dist/
npm run assets   # ref/ 原图 → public/ webp(需要本地 ref 素材)
```

## 目录

```
src/components/  Boot 开机自检 / Hud 常驻仪表 / Hero 首屏
                 Work 作品长廊 / Gallery 画廊 / Profile 档案
                 Contact 通讯频道 / Footer 跑马灯
src/scripts/     main.ts —— 全部 GSAP 动效(遵循 gsap-skills 官方军规)
public/          优化后的 webp 素材
ref/             本地参考素材(不入库)
```

彩蛋:键盘 ↑↑↓↓←→←→BA
