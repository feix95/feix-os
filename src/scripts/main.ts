// ============================================================
// FEIX.OS — 交互总指挥(全部动效按 gsap-skills 官方军规写)
// 军规:transform/autoAlpha 优先 · matchMedia 管响应式与减弱动效
//      quickTo 管鼠标跟随 · ScrollTrigger 顶层挂载、按页面顺序创建
// ============================================================
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: "expo.out", duration: 0.5 });

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const mm = gsap.matchMedia();

/* ---------------- 开机自检(只跑一次,sessionStorage 记账) ---------------- */
const boot = document.getElementById("boot");
const linesEl = document.getElementById("boot-lines");
const fill = document.getElementById("boot-fill")!;
const BOOT_LINES = [
  "mounting /gallery .......... OK",
  "loading operator profile ... OK",
  "decoding 猛男 assets ........ OK",
  "arming color weapons ....... OK",
  "ALL SYSTEMS NOMINAL",
];
let heroPlayed = false;

function heroIntro() {
  if (heroPlayed) return;
  heroPlayed = true;
  gsap
    .timeline()
    .from(".hero-eyebrow", { autoAlpha: 0, y: 14, duration: 0.35 }, 0)
    .from(".ht-text", { yPercent: 112, skewY: 5, duration: 0.55 }, 0.05)
    .from(".ht-text", { autoAlpha: 0.2, duration: 0.05, repeat: 2, ease: "none", yoyo: true }, 0.12)
    .from(".hero-cn", { autoAlpha: 0, x: -34, duration: 0.4 }, 0.32)
    .from(".hero-meta span", { autoAlpha: 0, y: 10, stagger: 0.06, duration: 0.3 }, 0.42)
    .from(".hero-scroll", { autoAlpha: 0, duration: 0.3 }, 0.6);
}

if (!boot) {
  heroIntro();
} else if (reduceMotion || sessionStorage.getItem("booted")) {
  boot.remove();
  heroIntro();
} else {
  document.documentElement.classList.add("is-booting");
  for (const text of BOOT_LINES) {
    const div = document.createElement("div");
    div.textContent = text;
    linesEl!.appendChild(div);
  }
  const tl = gsap.timeline({ onComplete: exitBoot });
  tl.from("#boot-lines div", { autoAlpha: 0, x: -10, stagger: 0.14, duration: 0.2, ease: "none" })
    .to(fill, { width: "100%", duration: 0.9, ease: "power2.inOut" }, 0.15)
    .from(".boot-skip", { autoAlpha: 0 }, 0);
  boot.addEventListener("click", () => tl.progress(1));

  function exitBoot() {
    sessionStorage.setItem("booted", "1");
    gsap
      .timeline()
      .to(".boot-core", { autoAlpha: 0, duration: 0.12, ease: "none" })
      .to(".boot-half--t", { yPercent: -101, duration: 0.5 }, 0)
      .to(".boot-half--b", { yPercent: 101, duration: 0.5 }, 0)
      .add(() => {
        boot.remove();
        document.documentElement.classList.remove("is-booting");
        ScrollTrigger.refresh();
      })
      .add(heroIntro, 0.18);
  }
}

/* ---------------- 准星光标(pointer:fine 专属,quickTo 军规) ---------------- */
if (window.matchMedia("(pointer: fine)").matches && !reduceMotion) {
  document.documentElement.classList.add("has-cursor");
  const cur = document.getElementById("cursor")!;
  const xTo = gsap.quickTo(cur, "x", { duration: 0.22, ease: "power3" });
  const yTo = gsap.quickTo(cur, "y", { duration: 0.22, ease: "power3" });
  window.addEventListener("mousemove", (e) => {
    xTo(e.clientX);
    yTo(e.clientY);
  });
  document.addEventListener("mouseover", (e) => {
    const hit = (e.target as Element).closest("a, [data-hover]");
    cur.classList.toggle("is-hover", !!hit);
  });
}

/* ---------------- 线框二十面体(黑舱里的常驻警灯) ---------------- */
function initWire() {
  const cv = document.getElementById("wire") as HTMLCanvasElement | null;
  if (!cv) return;
  const ctx = cv.getContext("2d")!;
  const t = (1 + Math.sqrt(5)) / 2;
  const raw = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
    [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
    [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
  ];
  const edges: number[] = [];
  for (let i = 0; i < 12; i++)
    for (let j = i + 1; j < 12; j++) {
      const dx = raw[i][0] - raw[j][0], dy = raw[i][1] - raw[j][1], dz = raw[i][2] - raw[j][2];
      if (Math.hypot(dx, dy, dz) < 2.2) edges.push(i, j);
    }
  let w = 0, h = 0, raf = 0, running = false, ry = 0, mx = 0;

  function resize() {
    const rect = cv.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width; h = rect.height;
    cv.width = w * dpr; cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function frame() {
    const R = Math.min(w, h) * 0.36, f = 4;
    ctx.clearRect(0, 0, w, h);
    ry += 0.0042 + mx * 0.0016;
    const rx = 0.42 + mx * 0.25;
    const pts = raw.map(([x, y, z]) => {
      let X = x * Math.cos(ry) + z * Math.sin(ry);
      let Z = -x * Math.sin(ry) + z * Math.cos(ry);
      const Y = y * Math.cos(rx) - Z * Math.sin(rx);
      Z = y * Math.sin(rx) + Z * Math.cos(rx);
      const s = f / (f + Z);
      return [w / 2 + X * R * s, h / 2 + Y * R * s];
    });
    ctx.strokeStyle = "rgba(200,255,46,0.4)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let k = 0; k < edges.length; k += 2) {
      const a = pts[edges[k]], b = pts[edges[k + 1]];
      ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]);
    }
    ctx.stroke();
    ctx.fillStyle = "rgba(244,244,240,0.9)";
    for (const p of pts) ctx.fillRect(p[0] - 2, p[1] - 2, 4, 4);
    if (running) raf = requestAnimationFrame(frame);
  }
  function play() { if (!running) { running = true; raf = requestAnimationFrame(frame); } }
  function pause() { running = false; cancelAnimationFrame(raf); }

  resize();
  window.addEventListener("resize", resize);
  if (reduceMotion) { frame(); return; }
  window.addEventListener("mousemove", (e) => {
    mx = (e.clientX / window.innerWidth - 0.5) * 2;
  });
  new IntersectionObserver(([en]) => (en.isIntersecting ? play() : pause())).observe(cv);
  play();
}
initWire();

/* ---------------- 档案电量槽:按 data-level 建出 12 格 ----------------
   matchMedia 条件变化时会重跑,必须先清空再建,否则格子会越叠越多
   减弱动效分支也要用,所以提到模块层 */
function buildSkillCells(skill: HTMLElement): HTMLElement | null {
  const cellsEl = skill.querySelector<HTMLElement>(".cells");
  if (!cellsEl) return null;
  const level = Number(skill.dataset.level || 0);
  cellsEl.replaceChildren();
  for (let i = 0; i < 12; i++) {
    const cell = document.createElement("i");
    if (i >= level) cell.className = "off";
    cellsEl.appendChild(cell);
  }
  return cellsEl;
}

/* ---------------- 滚动章节:全部按页面顺序创建 ---------------- */
mm.add(
  {
    // gsap.matchMedia 的条件对象:只有当至少一个条件命中时回调才会执行
    // isDesktop + isMobile 必须覆盖全部宽度,否则窄屏(手机)下整块设置永远不跑
    isDesktop: "(min-width: 900px)",
    isMobile: "(max-width: 899px)",
    reduceMotion: "(prefers-reduced-motion: reduce)",
  },
  (ctx) => {
    const { isDesktop, reduceMotion: rm } = ctx.conditions;

    /* EP.01 横向长廊:桌面 = 竖滚横移(containerAnimation 军规:ease none) */
    if (isDesktop && !rm) {
      const track = document.getElementById("atlas-track")!;
      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: "#work",
          start: "top top",
          end: () => "+=" + (track.scrollWidth - window.innerWidth),
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }

    if (!rm) {
      /* 章节头与档案:硬砸进场 */
      gsap.utils.toArray<HTMLElement>(".sec-head").forEach((head) => {
        gsap.from(head.children, {
          autoAlpha: 0,
          yPercent: 60,
          stagger: 0.07,
          duration: 0.45,
          scrollTrigger: { trigger: head, start: "top 82%", once: true },
        });
      });

      /* 画廊:批量翻牌 */
      ScrollTrigger.batch(".gal-item", {
        start: "top 88%",
        once: true,
        onEnter: (batch) =>
          gsap.from(batch, { autoAlpha: 0, yPercent: 30, stagger: 0.12, duration: 0.5 }),
      });

      /* 档案电量槽:一格一格拍进去 */
      document.querySelectorAll<HTMLElement>(".skill").forEach((skill) => {
        const cellsEl = buildSkillCells(skill);
        if (!cellsEl) return;
        gsap.from(cellsEl.querySelectorAll("i:not(.off)"), {
          scaleX: 0,
          stagger: 0.05,
          duration: 0.22,
          ease: "power3.out",
          scrollTrigger: { trigger: skill, start: "top 88%", once: true },
        });
      });

      /* 通讯频道:左切进场 */
      gsap.from(".tx-row", {
        autoAlpha: 0,
        xPercent: -24,
        stagger: 0.09,
        duration: 0.45,
        scrollTrigger: { trigger: ".tx-list", start: "top 80%", once: true },
      });

      /* HP 滚动进度条 */
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const pct = Math.round(self.progress * 100);
          document.getElementById("hud-pct")!.textContent =
            String(pct).padStart(3, "0") + "%";
          gsap.set("#hud-bar", { scaleX: self.progress });
        },
      });
    } else {
      /* 减弱动效:直接呈现终态 */
      document.getElementById("hud-pct")!.textContent = "";
      document.querySelectorAll<HTMLElement>(".skill").forEach(buildSkillCells);
    }
  }
);

/* ---------------- 科乐美秘技:OVERDRIVE 失控模式 ---------------- */
const SEQ = [
  "arrowup", "arrowup", "arrowdown", "arrowdown",
  "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a",
];
let idx = 0;
window.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  idx = key === SEQ[idx] ? idx + 1 : key === SEQ[0] ? 1 : 0;
  if (idx === SEQ.length) {
    idx = 0;
    document.documentElement.classList.add("overdrive");
    setTimeout(
      () => document.documentElement.classList.remove("overdrive"),
      3500
    );
  }
});
