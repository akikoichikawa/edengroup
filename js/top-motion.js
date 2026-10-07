(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  document.body.classList.add("motion-ready");
  document
    .querySelectorAll(".profile-panel dl>div")
    .forEach((row, i) => row.style.setProperty("--row", i));
  const links = [...document.querySelectorAll('.nav a[href^="#"]')];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  const layers = [...document.querySelectorAll(".business-card .card-media,.vision-image")];
  const activeLayers = new Set();
  const viewport = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) activeLayers.add(entry.target);
        else activeLayers.delete(entry.target);
      }),
    { rootMargin: "100px" },
  );
  layers.forEach((layer) => viewport.observe(layer));
  let frame = 0;
  const update = () => {
    frame = 0;
    let current = "";
    for (const section of sections)
      if (section.getBoundingClientRect().top < innerHeight * 0.4) current = section.id;
    links.forEach((link) => {
      const active = link.getAttribute("href") === "#" + current;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    if (reduced.matches) return;
    activeLayers.forEach((layer) => {
      const rect = layer.parentElement.getBoundingClientRect();
      const depth = Math.max(
        -22,
        Math.min(22, (innerHeight / 2 - rect.top - rect.height / 2) * 0.045),
      );
      layer.style.setProperty("--depth", depth.toFixed(1) + "px");
    });
    const footer = document.querySelector(".footer-display");
    if (footer) {
      const rect = footer.getBoundingClientRect();
      if (rect.top < innerHeight)
        footer.style.setProperty(
          "--footer-shift",
          Math.max(0, Math.min(24, (rect.top / innerHeight) * 24)) + "px",
        );
    }
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  addEventListener("scroll", schedule, { passive: true });
  addEventListener("resize", schedule, { passive: true });
  reduced.addEventListener("change", () => {
    layers.forEach((layer) => layer.style.removeProperty("--depth"));
    schedule();
  });
  document.addEventListener("visibilitychange", () =>
    document.body.classList.toggle("motion-paused", document.hidden),
  );
  update();
})();

(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const hero = document.querySelector(".hero"),
    group = document.querySelector(".group"),
    vision = document.querySelector(".vision"),
    photo = document.querySelector(".events-photo");
  if (hero) {
    const dust = document.createElement("div");
    dust.className = "hero-orbit";
    dust.setAttribute("aria-hidden", "true");
    for (let i = 0; i < 18; i++) {
      const dot = document.createElement("b");
      dot.style.cssText = `--x:${35 + ((i * 17) % 63)}%;--y:${12 + ((i * 23) % 78)}%;--t:${8 + (i % 7)}s;--d:-${i * 0.8}s`;
      dust.append(dot);
    }
    hero.append(dust);
  }
  let frame = 0;
  function draw() {
    frame = 0;
    if (reduced.matches) return;
    if (hero) {
      const r = hero.getBoundingClientRect();
      if (r.bottom > 0)
        hero.style.setProperty("--hero-depth", Math.min(65, Math.max(0, -r.top * 0.12)) + "px");
    }
    if (vision) {
      const r = vision.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0)
        vision.style.setProperty(
          "--vision-depth",
          Math.max(-25, Math.min(25, (innerHeight / 2 - r.top - r.height / 2) * 0.06)) + "px",
        );
    }
    if (photo) {
      const r = photo.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0)
        photo.style.setProperty(
          "--photo-depth",
          Math.max(-25, Math.min(25, (innerHeight / 2 - r.top - r.height / 2) * 0.06)) + "px",
        );
    }
  }
  const request = () => {
    if (!frame) frame = requestAnimationFrame(draw);
  };
  addEventListener("scroll", request, { passive: true });
  addEventListener("resize", request, { passive: true });
  reduced.addEventListener("change", () => {
    [hero, vision, photo]
      .filter(Boolean)
      .forEach((el) =>
        ["--hero-depth", "--vision-depth", "--photo-depth"].forEach((k) =>
          el.style.removeProperty(k),
        ),
      );
    request();
  });
  if (group && matchMedia("(pointer:fine)").matches)
    group.addEventListener(
      "pointermove",
      (e) => {
        if (!reduced.matches)
          group.style.setProperty(
            "--glow-x",
            ((e.clientX - group.getBoundingClientRect().left) / group.clientWidth) * 100 + "%",
          );
      },
      { passive: true },
    );
  request();
})();

(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const hero = document.querySelector(".hero");
  const universe = document.querySelector(".eden-universe");
  if (hero) {
    const light = document.createElement("div");
    light.className = "hero-signature-light";
    light.setAttribute("aria-hidden", "true");
    hero.append(light);
  }
  if (universe) {
    universe
      .querySelectorAll(".eden-satellite")
      .forEach((el, i) => el.style.setProperty("--arrival", `${220 + i * 110}ms`));
    universe
      .querySelectorAll(".future-mark")
      .forEach((el, i) => el.style.setProperty("--arrival", `${i * 900}ms`));
  }
  const observed = document.querySelectorAll(
    ".hero,.eden-universe,.events-photo,.business-card.venture",
  );
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        entry.target.classList.toggle("motion-in-view", entry.isIntersecting);
        if (entry.isIntersecting) entry.target.classList.add("prestige-visible");
      }),
    { threshold: 0.08 },
  );
  observed.forEach((el) => observer.observe(el));
  document.body.classList.add("luxury-ready");
  const emblem = document.querySelector(".hero-emblem");
  if (hero && emblem && matchMedia("(pointer:fine)").matches) {
    let frame = 0,
      x = 0,
      y = 0;
    hero.addEventListener(
      "pointermove",
      (event) => {
        if (reduced.matches) return;
        const r = hero.getBoundingClientRect();
        x = (event.clientX - r.left) / r.width - 0.5;
        y = (event.clientY - r.top) / r.height - 0.5;
        if (!frame)
          frame = requestAnimationFrame(() => {
            frame = 0;
            emblem.style.setProperty("--tilt-x", `${x * 9}deg`);
            emblem.style.setProperty("--tilt-y", `${-y * 7}deg`);
          });
      },
      { passive: true },
    );
    const reset = () => {
      emblem.style.removeProperty("--tilt-x");
      emblem.style.removeProperty("--tilt-y");
    };
    hero.addEventListener("pointerleave", reset);
    reduced.addEventListener("change", reset);
  }
})();
