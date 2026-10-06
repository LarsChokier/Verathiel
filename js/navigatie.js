/**
 * Navigatiebalk: menu op mobiel, achtergrond na het scrollen
 * en het actieve onderdeel markeren.
 */
import { $, $$, bijScrollen } from "./hulpmiddelen.js";

export function initNavigatie() {
  const nav = $("#nav");
  const menuKnop = $("#navMenu");
  const links = $("#navLinks");

  const zetMenu = (open) => {
    menuKnop.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("menu-open", open);
  };

  menuKnop.addEventListener("click", () => zetMenu(menuKnop.getAttribute("aria-expanded") !== "true"));
  links.addEventListener("click", (e) => {
    if (e.target.closest("a")) zetMenu(false);
  });

  bijScrollen(() => nav.classList.toggle("is-vast", scrollY > 40));

  const observer = new IntersectionObserver(
    (items) => {
      items.forEach((item) => {
        if (!item.isIntersecting) return;
        $$("a", links).forEach((a) =>
          a.classList.toggle("actief", a.getAttribute("href") === `#${item.target.id}`),
        );
      });
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );
  $$("main > section[id]").forEach((sectie) => observer.observe(sectie));
}
