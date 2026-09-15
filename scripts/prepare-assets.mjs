// 素材预处理:ref/ 原图 → public/ webp 优化版
// 用法:npm run assets
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const REF = path.resolve("ref");
const OUT = path.resolve("public");

const ART = [
  ["个人作品/4E87C76A9D2AC05ADF90F293C7EBABA3.jpg", "art/art-hisoka.webp"],
  ["个人作品/niren.jpg", "art/art-niren.webp"],
  ["个人作品/raian_shy2.jpg", "art/art-raian.webp"],
  ["个人作品/yiwozuo.jpg", "art/art-akaza-01.webp"],
  ["个人作品/yiwozuo-shuang.jpg", "art/art-akaza-02.webp"],
];

const SHOTS = [
  ["code-atlas ui截图/0b3f783c6c4d2db5f153a7a018bc0cdd.png", "atlas/shot-01-probe.webp"],
  ["code-atlas ui截图/146a029596494dae6c38c44dbcdfff1d.png", "atlas/shot-02-overview.webp"],
  ["code-atlas ui截图/f3455015a889c294ec7cdb63132ce277.png", "atlas/shot-03-preview.webp"],
  ["code-atlas ui截图/fc51d099a591dd5d2634b9b06cb606d0.png", "atlas/shot-04-settings.webp"],
];

async function convert(rel, out, width, quality) {
  const dest = path.join(OUT, out);
  await mkdir(path.dirname(dest), { recursive: true });
  const info = await sharp(path.join(REF, rel))
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality })
    .toFile(dest);
  console.log(`${out}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}KB`);
}

await mkdir(path.join(OUT, "art"), { recursive: true });
await mkdir(path.join(OUT, "atlas"), { recursive: true });

for (const [rel, out] of ART) await convert(rel, out, 1600, 82);
for (const [rel, out] of SHOTS) await convert(rel, out, 2000, 85);

console.log("全部素材处理完毕");
