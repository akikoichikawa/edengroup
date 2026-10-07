const button = document.querySelector(".menu-toggle"),
  nav = document.querySelector("#nav");
button.addEventListener("click", () => {
  const open = button.getAttribute("aria-expanded") !== "true";
  button.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("open", open);
});
nav.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    button.setAttribute("aria-expanded", "false");
  }),
);
const observer = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    }),
  { threshold: 0.1 },
);
document.querySelectorAll(".section,.winner,.statement").forEach((el) => observer.observe(el));
