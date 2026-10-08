// 背景モーション：金の粒子（ゴールドダスト）
// <section class="has-particles"> の先頭に <canvas class="gold-dust" aria-hidden="true"></canvas> を置くと動作する。
// 明るい背景のセクションには class="particles-light" を付けると濃い金で描画する。
(() => {
  const canvases = document.querySelectorAll(".gold-dust");
  if (!canvases.length) return;
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const rand = (min, max) => min + Math.random() * (max - min);

  canvases.forEach((canvas) => {
    const ctx = canvas.getContext("2d");
    const light = canvas.closest(".particles-light") !== null;
    const rgb = light ? "150, 112, 58" : "236, 202, 136";
    let width = 0;
    let height = 0;
    let particles = [];
    let running = false;
    let frame = 0;

    const makeParticle = (anywhere) => {
      const bokeh = Math.random() < 0.12;
      return {
        x: rand(0, width),
        y: anywhere ? rand(0, height) : height + rand(0, 40),
        r: bokeh ? rand(4, 9) : rand(0.8, 2.4),
        vy: bokeh ? rand(0.08, 0.2) : rand(0.15, 0.45),
        drift: rand(0.2, 0.7),
        phase: rand(0, Math.PI * 2),
        twinkle: rand(0.015, 0.04),
        alpha: bokeh ? rand(0.1, 0.22) : rand(0.35, 0.9),
        bokeh,
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
      const count = Math.min(110, Math.round((width * height) / (width < 700 ? 8000 : 10000)));
      particles = Array.from({ length: count }, () => makeParticle(true));
      if (!running) draw(0);
    };

    const draw = (t) => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        const a = p.alpha * (0.55 + 0.45 * Math.sin(t * p.twinkle + p.phase));
        const x = p.x + Math.sin(t * 0.01 + p.phase) * p.drift * 12;
        if (p.bokeh) {
          const g = ctx.createRadialGradient(x, p.y, 0, x, p.y, p.r * 2.2);
          g.addColorStop(0, `rgba(${rgb}, ${a})`);
          g.addColorStop(1, `rgba(${rgb}, 0)`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(x, p.y, p.r * 2.2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = `rgba(${rgb}, ${a})`;
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
        const p = particles[i];
        p.y -= p.vy;
        if (p.y < -20) particles[i] = makeParticle(false);
      }
      draw(frame);
      requestAnimationFrame(step);
    };

    resize();
    new ResizeObserver(resize).observe(canvas);
    if (reduceMotion) return;

    // 画面に見えている間だけ動かす
    new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !running) {
          running = true;
          requestAnimationFrame(step);
        } else if (!e.isIntersecting) {
          running = false;
        }
      });
    }).observe(canvas);
  });
})();
