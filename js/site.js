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
const header = document.querySelector(".header");
addEventListener("scroll", () => header.classList.toggle("scrolled", scrollY > 30), {
  passive: true,
});
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
