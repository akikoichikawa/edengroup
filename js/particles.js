// 背景モーション：金の粒子（ゴールドダスト）
// セクションに class="has-particles" を付け、先頭に
//   <div class="gold-dust-wrap" aria-hidden="true"><canvas class="gold-dust"></canvas></div>
// を置くと動作する。写真の上に重ねるセクションは class="particles-over" も付ける。
// data-density="0.5" で粒の量を調整できる（既定は1）。
//
// 表示速度への配慮
// - キャンバスは画面の高さまで（sticky で画面内に固定）。セクションが長くても大きくならない
// - 画面に見えているセクションだけ描画し、見えなくなったらキャンバスのメモリを解放する
// - 動きを減らす設定の端末では静止画として1回だけ描画する
(() => {
  const canvases = document.querySelectorAll(".gold-dust");
  if (!canvases.length) return;
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rand = (min, max) => min + Math.random() * (max - min);

  // セクションの背景色から明るさを判定（写真の上は暗い扱い）
  const isLightSection = (section) => {
    if (section.classList.contains("particles-over")) return false;
    for (let el = section; el; el = el.parentElement) {
      const m = getComputedStyle(el).backgroundColor.match(/[\d.]+/g);
      if (m && (m.length < 4 || +m[3] > 0)) {
        const [r, g, b] = m.map(Number);
        return 0.299 * r + 0.587 * g + 0.114 * b > 150;
      }
    }
    return true;
  };

  canvases.forEach((canvas) => {
    const section = canvas.closest(".has-particles");
    const ctx = canvas.getContext("2d");
    const light = isLightSection(section);
    const rgb = light ? "150, 112, 58" : "240, 208, 142";
    const density = parseFloat(section.dataset.density || "1");
    let width = 0;
    let height = 0;
    let particles = [];
    let running = false;
    let frame = 0;

    const makeParticle = (anywhere) => {
      const roll = Math.random();
      const type = roll < 0.1 ? "bokeh" : roll < 0.16 ? "star" : "dust";
      return {
        type,
        x: rand(0, width),
        y: anywhere ? rand(0, height) : height + rand(0, 40),
        r: type === "bokeh" ? rand(4, 9) : type === "star" ? rand(3.5, 7) : rand(0.8, 2.4),
        vy: type === "bokeh" ? rand(0.08, 0.2) : rand(0.15, 0.45),
        drift: rand(0.2, 0.7),
        phase: rand(0, Math.PI * 2),
        twinkle: type === "star" ? rand(0.02, 0.045) : rand(0.015, 0.04),
        alpha: type === "bokeh" ? rand(0.1, 0.22) : type === "star" ? rand(0.4, 0.65) : rand(0.35, 0.9),
      };
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(120, Math.round(((width * height) / (width < 700 ? 8000 : 10000)) * density));
      particles = Array.from({ length: count }, () => makeParticle(true));
      draw(frame);
    };

    // 4方向に光が伸びるきらめき
    const drawStar = (x, y, size, a) => {
      ctx.strokeStyle = `rgba(${rgb}, ${a})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x - size, y);
      ctx.lineTo(x + size, y);
      ctx.moveTo(x, y - size);
      ctx.lineTo(x, y + size);
      ctx.stroke();
      const g = ctx.createRadialGradient(x, y, 0, x, y, size * 0.45);
      g.addColorStop(0, `rgba(255, 246, 222, ${a})`);
      g.addColorStop(1, `rgba(${rgb}, 0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, size * 0.45, 0, Math.PI * 2);
      ctx.fill();
    };

    const draw = (t) => {
      ctx.clearRect(0, 0, width, height);
      // 暗い背景では光が重なるように加算合成
      ctx.globalCompositeOperation = light ? "source-over" : "lighter";
      for (const p of particles) {
        const x = p.x + Math.sin(t * 0.01 + p.phase) * p.drift * 12;
        const wave = Math.sin(t * p.twinkle + p.phase);
        if (p.type === "star") {
          // ふだんは見えず、ときどき強く光る
          const flash = Math.pow(Math.max(0, wave), 8);
          if (flash > 0.02) drawStar(x, p.y, p.r * (0.6 + 0.4 * flash), p.alpha * flash);
        } else if (p.type === "bokeh") {
          const a = p.alpha * (0.55 + 0.45 * wave);
          const g = ctx.createRadialGradient(x, p.y, 0, x, p.y, p.r * 2.2);
          g.addColorStop(0, `rgba(${rgb}, ${a})`);
          g.addColorStop(1, `rgba(${rgb}, 0)`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(x, p.y, p.r * 2.2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = `rgba(${rgb}, ${p.alpha * (0.55 + 0.45 * wave)})`;
          ctx.beginPath();
          ctx.arc(x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const step = () => {
      if (!running) return;
      frame++;
      for (let i = 0; i < particles.length; i++) {
        particles[i].y -= particles[i].vy;
        if (particles[i].y < -20) particles[i] = makeParticle(false);
      }
      draw(frame);
      requestAnimationFrame(step);
    };

    const start = () => {
      resize();
      if (reduceMotion || running) return;
      running = true;
      requestAnimationFrame(step);
    };
    const stop = () => {
      running = false;
      canvas.width = 0;
      canvas.height = 0;
    };

    new ResizeObserver(() => running && resize()).observe(canvas);
    new IntersectionObserver((entries) => entries.forEach((e) => (e.isIntersecting ? start() : stop())), {
      rootMargin: "100px 0px",
    }).observe(section);
  });
})();
