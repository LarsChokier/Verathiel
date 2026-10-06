/**
 * Hulpmiddelen die door alle modules gedeeld worden.
 */

export const $ = (selector, ouder = document) => ouder.querySelector(selector);
export const $$ = (selector, ouder = document) => [...ouder.querySelectorAll(selector)];

export const minderBeweging = matchMedia("(prefers-reduced-motion: reduce)").matches;
export const fijneAanwijzer = matchMedia("(pointer: fine)").matches;

export const ROMEINS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

/** Haalt een JSON-bestand op uit de map data/. */
export async function laadJSON(pad) {
  const antwoord = await fetch(pad);
  if (!antwoord.ok) throw new Error(`Kon ${pad} niet laden (status ${antwoord.status})`);
  return antwoord.json();
}

/** Houdt bij of een element in beeld is, zodat animaties buiten beeld kunnen pauzeren. */
export function volgZichtbaarheid(element) {
  const staat = { zichtbaar: false };
  new IntersectionObserver(([item]) => {
    staat.zichtbaar = item.isIntersecting;
  }).observe(element);
  return staat;
}

/** Zet een canvas op de juiste pixelgrootte voor scherpe weergave. */
export function schaalCanvas(canvas, context) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const vak = canvas.getBoundingClientRect();
  canvas.width = Math.round(vak.width * dpr);
  canvas.height = Math.round(vak.height * dpr);
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { breedte: vak.width, hoogte: vak.height };
}

/** Speelt een CSS-animatie opnieuw af. */
export function herstartAnimatie(element, klasse) {
  element.classList.remove(klasse);
  void element.offsetWidth;
  element.classList.add(klasse);
}

/* ---------- gedeelde lussen ---------- */

const frameStappen = new Set();
let lusDraait = false;

/** Voert een functie elk frame uit (niet bij "minder beweging"). */
export function elkFrame(stap) {
  if (minderBeweging) return;
  frameStappen.add(stap);
  if (lusDraait) return;
  lusDraait = true;
  const lus = (tijd) => {
    if (!document.hidden) frameStappen.forEach((f) => f(tijd));
    requestAnimationFrame(lus);
  };
  requestAnimationFrame(lus);
}

const scrollStappen = new Set();
let scrollGepland = false;

/** Voert een functie uit bij scrollen, hoogstens één keer per frame. */
export function bijScrollen(stap) {
  scrollStappen.add(stap);
  stap();
}
function planScroll() {
  if (scrollGepland) return;
  scrollGepland = true;
  requestAnimationFrame(() => {
    scrollGepland = false;
    scrollStappen.forEach((f) => f());
  });
}
addEventListener("scroll", planScroll, { passive: true });

/** Voert een functie uit nadat het venster klaar is met van grootte veranderen. */
export function bijResize(stap) {
  let timer;
  addEventListener("resize", () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      stap();
      planScroll();
    }, 120);
  });
}
