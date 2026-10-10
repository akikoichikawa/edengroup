// EDEN Group サイト共通の動き（トップ・下層ページ）
(() => {
  const root = document.documentElement;
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const header = document.querySelector(".header");
  const progress = document.querySelector(".progress");

  // ---------- スムーススクロール ----------
  let lenis = null;
  if (!reduceMotion && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    const raf = (t) => {
      lenis.raf(t);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }
  const scrollToHash = (hash) => {
    const target = hash === "#top" ? document.body : document.querySelector(hash);
    if (!target) return false;
    if (lenis) lenis.scrollTo(target, { offset: hash === "#top" ? 0 : -70 });
    else target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    return true;
  };
  document.querySelectorAll('a[href^="#"]:not(.sat)').forEach((a) => {
    a.addEventListener("click", (e) => {
      const hash = a.getAttribute("href");
      if (hash.length < 2) {
        e.preventDefault();
        scrollToHash("#top");
        return;
      }
      if (scrollToHash(hash)) {
        e.preventDefault();
        history.replaceState(null, "", hash);
      }
    });
  });

  // ---------- メニュー ----------
  const menu = document.querySelector(".menu");
  const nav = document.querySelector(".nav");
  const setMenu = (open) => {
    menu.setAttribute("aria-expanded", String(open));
    menu.textContent = open ? "CLOSE" : "MENU";
    nav.classList.toggle("open", open);
    if (lenis) open ? lenis.stop() : lenis.start();
  };
  // 共通ヘッダーのないページ（BEST OF MISS FUKUOKA）では、ページ側のメニュー処理を使う
  if (menu && nav) {
    menu.addEventListener("click", () => setMenu(menu.getAttribute("aria-expanded") !== "true"));
    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
    addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));
  }

  // ---------- ヘッダー・進捗バー・パララックス ----------
  const parallax = [...document.querySelectorAll("[data-parallax]")];
  let ticking = false;
  const onScroll = () => {
    const y = scrollY;
    if (header) header.classList.toggle("scrolled", y > 40);
    const max = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    if (!reduceMotion) {
      parallax.forEach((img) => {
        const box = img.parentElement.getBoundingClientRect();
        if (box.bottom < 0 || box.top > innerHeight) return;
        const p = (box.top + box.height / 2 - innerHeight / 2) / innerHeight;
        img.style.transform = `translate3d(0, ${(p * -12).toFixed(2)}%, 0)`;
      });
    }
    updateWords();
    ticking = false;
  };
  addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(onScroll);
      }
    },
    { passive: true },
  );

  // ---------- ヒーローのスライド ----------
  const slides = [...document.querySelectorAll(".hero-slide")];
  const count = document.querySelector(".hero-count");
  const bar = document.querySelector(".hero-bar i");
  const SLIDE_MS = 6000;
  let current = 0;
  const runBar = () => {
    bar.classList.remove("is-running");
    void bar.offsetWidth;
    bar.style.setProperty("--slide-ms", SLIDE_MS + "ms");
    bar.classList.add("is-running");
  };
  if (slides.length > 1 && bar && !reduceMotion) {
    runBar();
    setInterval(() => {
      if (document.hidden) return;
      slides[current].classList.remove("is-active");
      current = (current + 1) % slides.length;
      slides[current].classList.add("is-active");
      count.textContent = String(current + 1).padStart(2, "0");
      runBar();
    }, SLIDE_MS);
  }

  // ---------- オープニング ----------
  const finishIntro = () => {
    if (root.classList.contains("is-ready")) return;
    root.classList.add("is-ready");
    try {
      sessionStorage.setItem("edenIntro", "1");
    } catch (e) {}
  };
  if (!root.classList.contains("is-ready")) {
    const started = performance.now();
    const done = () => setTimeout(finishIntro, Math.max(0, 1300 - (performance.now() - started)));
    if (document.readyState === "complete") done();
    else addEventListener("load", done, { once: true });
    setTimeout(finishIntro, 3000); // 読み込みが遅くても3秒で必ず開く
  }

  // ---------- 大きな英字見出しを1文字ずつに分ける ----------
  document.querySelectorAll(".display-en").forEach((el) => {
    const text = el.textContent.trim();
    el.setAttribute("aria-label", text);
    // 単語の途中で折り返さないよう、単語ごとにまとめてから1文字ずつに分ける
    let n = 0;
    el.innerHTML = text
      .split(" ")
      .map(
        (word) =>
          `<span class="word" aria-hidden="true">${[...word]
            .map((c) => `<span class="ch" style="--i:${n++}">${c}</span>`)
            .join("")}</span>`,
      )
      .join(" ");
  });
  document.querySelectorAll(".biz-row").forEach((row, i) => row.style.setProperty("--d", i % 4));

  // ---------- 磁石のように寄るボタン ----------
  if (finePointer && !reduceMotion) {
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - 0.5) * 16;
        const y = ((e.clientY - r.top) / r.height - 0.5) * 12;
        el.style.translate = `${x}px ${y}px`;
      });
      el.addEventListener("mouseleave", () => (el.style.translate = "0 0"));
    });
  }

  // ---------- 事業マップ：マウスを乗せた事業と中央を線でつなぐ ----------
  document.querySelectorAll(".sat").forEach((sat) => {
    const line = document.querySelector(`.universe-links line[data-key="${sat.dataset.key}"]`);
    if (!line) return;
    const on = () => line.classList.add("is-on");
    const off = () => line.classList.remove("is-on");
    sat.addEventListener("mouseenter", on);
    sat.addEventListener("mouseleave", off);
    sat.addEventListener("focus", on);
    sat.addEventListener("blur", off);
  });

  // ---------- 事業マップ（スマホ）：順番に光らせ、タップで選ぶ ----------
  const universe = document.querySelector(".universe");
  const caption = document.querySelector(".universe-caption");
  if (universe && caption) {
    const mobile = matchMedia("(max-width: 900px)");
    const sats = [...universe.querySelectorAll(".sat")].sort((a, b) => a.dataset.order - b.dataset.order);
    const capText = caption.querySelector(".cap-text");
    const dots = [...caption.querySelectorAll(".cap-dots i")];
    let active = 0;
    let timer = null;
    let inView = false;
    let angle = 0;
    const show = (i, byUser = false) => {
      // 自動で切り替わるときは読み上げない（操作したときだけ読み上げる）
      caption.setAttribute("aria-live", byUser ? "polite" : "off");
      active = (i + sats.length) % sats.length;
      const sat = sats[active];
      sats.forEach((s) => s.classList.toggle("is-active", s === sat));
      const tone = getComputedStyle(sat).getPropertyValue("--tone").trim();
      caption.style.setProperty("--cap-tone", tone);
      caption.querySelector(".cap-num").textContent = String(active + 1).padStart(2, "0");
      caption.querySelector(".cap-jp").textContent = sat.querySelector(".sat-jp").textContent;
      caption.querySelector(".cap-en").textContent = sat.querySelector(".sat-en").textContent;
      caption.querySelector(".cap-desc").textContent = sat.dataset.desc;
      caption.querySelector(".cap-link").setAttribute("href", sat.getAttribute("href"));
      dots.forEach((d, n) => d.classList.toggle("is-on", n === active));
      // 時計の針のように、最短の向きで回す
      const target = (active * 360) / sats.length;
      let diff = ((target - (angle % 360) + 540) % 360) - 180;
      angle += diff;
      universe.style.setProperty("--dial", angle + "deg");
      universe.style.setProperty("--dial-tone", tone);
      capText.classList.remove("is-swapping");
      void capText.offsetWidth;
      capText.classList.add("is-swapping");
    };
    const play = () => {
      clearInterval(timer);
      if (!reduceMotion && inView && mobile.matches) timer = setInterval(() => show(active + 1), 2600);
    };
    const pick = (i) => {
      show(i, true);
      clearInterval(timer);
      timer = setTimeout(play, 7000); // 選んだ後は少し待ってから自動再生を再開
    };
    // 左右にスワイプして前後の事業へ
    let sx = 0,
      sy = 0;
    universe.addEventListener(
      "touchstart",
      (e) => {
        sx = e.touches[0].clientX;
        sy = e.touches[0].clientY;
      },
      { passive: true },
    );
    universe.addEventListener(
      "touchend",
      (e) => {
        if (!mobile.matches) return;
        const dx = e.changedTouches[0].clientX - sx;
        const dy = e.changedTouches[0].clientY - sy;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) pick(active + (dx < 0 ? 1 : -1));
      },
      { passive: true },
    );
    sats.forEach((sat, i) =>
      sat.addEventListener("click", (e) => {
        e.preventDefault();
        if (!mobile.matches) {
          scrollToHash(sat.getAttribute("href")); // パソコンでは事業一覧へ移動
          return;
        }
        pick(i);
      }),
    );
    new IntersectionObserver((entries) => {
      inView = entries[0].isIntersecting;
      inView ? play() : clearInterval(timer);
    }).observe(universe);
    mobile.addEventListener("change", play);
    show(0);
  }

  // ---------- スクロールで表示 ----------
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.15, rootMargin: "0px 0px -6% 0px" },
  );
  document.querySelectorAll("[data-reveal], [data-clip]").forEach((el) => io.observe(el));

  // ---------- ステートメント：スクロールで1語ずつ色が入る ----------
  const statement = document.querySelector("[data-words]");
  let words = [];
  if (statement) {
    const text = statement.textContent.trim();
    const parts =
      "Segmenter" in Intl
        ? [...new Intl.Segmenter("ja", { granularity: "word" }).segment(text)].map((s) => s.segment)
        : [...text];
    statement.setAttribute("aria-label", text);
    statement.innerHTML = parts.map((w) => `<span class="w" aria-hidden="true">${w}</span>`).join("");
    words = [...statement.querySelectorAll(".w")];
  }
  function updateWords() {
    if (!words.length) return;
    const box = statement.getBoundingClientRect();
    const start = innerHeight * 0.85;
    const end = innerHeight * 0.3;
    const p = Math.min(1, Math.max(0, (start - box.top) / (start - end + box.height * 0.6)));
    const on = Math.round(p * words.length);
    words.forEach((w, i) => w.classList.toggle("is-on", i < on));
  }
  if (reduceMotion) words.forEach((w) => w.classList.add("is-on"));

  // ---------- カーソル・事業一覧の画像 ----------
  if (finePointer && !reduceMotion && document.querySelector(".cursor")) {
    root.classList.add("has-cursor");
    const cursor = document.querySelector(".cursor");
    const float = document.querySelector(".biz-float");
    const floatImg = float ? float.querySelector("img") : null;
    let mx = innerWidth / 2,
      my = innerHeight / 2,
      cx = mx,
      cy = my,
      fx = mx,
      fy = my;
    addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
    });
    const loop = () => {
      cx += (mx - cx) * 0.22;
      cy += (my - cy) * 0.22;
      fx += (mx - fx) * 0.1;
      fy += (my - fy) * 0.1;
      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      if (float) {
        float.style.left = fx + "px";
        float.style.top = fy + "px";
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    document.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("is-link"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("is-link"));
    });
    document.querySelectorAll(".biz-row").forEach((row) => {
      row.addEventListener("mouseenter", () => {
        if (!float) return;
        floatImg.src = row.dataset.img;
        float.classList.add("is-on");
        if (row.tagName === "A") cursor.classList.add("is-view");
      });
      row.addEventListener("mouseleave", () => {
        if (float) float.classList.remove("is-on");
        cursor.classList.remove("is-view");
      });
    });
    document.querySelectorAll("video, .bom-movie-player").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("is-hidden"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("is-hidden"));
    });
  }

  onScroll();
})();
