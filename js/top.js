const menu = document.querySelector(".menu"),
  nav = document.querySelector(".nav");
menu.addEventListener("click", () => {
  const open = menu.getAttribute("aria-expanded") !== "true";
  menu.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("open", open);
});
nav.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
  }),
);
const reveal = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        reveal.unobserve(e.target);
      }
    }),
  { threshold: 0.12 },
);
document.querySelectorAll("[data-reveal]").forEach((el) => reveal.observe(el));
const sectionMotion = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in-view");
        sectionMotion.unobserve(e.target);
      }
    }),
  { threshold: 0.15 },
);
document.querySelectorAll(".about-facts,.vision").forEach((el) => sectionMotion.observe(el));
let ticking = false;
const header = document.querySelector(".header");
const motionOK = !matchMedia("(prefers-reduced-motion: reduce)").matches;
function updateScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  document.querySelector(".progress").style.width = (max > 0 ? (scrollY / max) * 100 : 0) + "%";
  header.classList.toggle("scrolled", scrollY > 30);
  if (motionOK) {
    const photo = document.querySelector(".events-photo"),
      image = photo?.querySelector("img");
    if (photo && image) {
      const rect = photo.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < innerHeight) {
        const progress = (innerHeight / 2 - (rect.top + rect.height / 2)) / innerHeight;
        image.style.setProperty("--image-shift", Math.max(-32, Math.min(32, progress * 50)) + "px");
      }
    }
  }
  ticking = false;
}
window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      requestAnimationFrame(updateScroll);
      ticking = true;
    }
  },
  { passive: true },
);
updateScroll();
