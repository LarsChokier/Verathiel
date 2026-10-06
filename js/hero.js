/**
 * Hero: opstijgende lichtvonken die naar de cursor toe drijven,
 * en een rustig parallax-effect op de achtergrondfoto.
 */
import {
  $,
  minderBeweging,
  volgZichtbaarheid,
  schaalCanvas,
  elkFrame,
  bijScrollen,
  bijResize,
} from "./hulpmiddelen.js";

const AANTREKKING_STRAAL = 170;

export function initHero() {
  const hero = $("#begin");
  const beeld = $("#heroBeeld");
  const canvas = $("#vonken");
  const ctx = canvas.getContext("2d");
  const zicht = volgZichtbaarheid(hero);
  const muis = { x: -999, y: -999 };

  let breedte = 0;
  let hoogte = 0;
  let vonken = [];

  const nieuweVonk = (ergensInBeeld) => ({
    x: Math.random() * breedte,
    y: ergensInBeeld ? Math.random() * hoogte : hoogte + 10,
    straal: 0.6 + Math.random() * 1.7,
    snelheid: 0.22 + Math.random() * 0.65,
    fase: Math.random() * Math.PI * 2,
    zwaai: 0.3 + Math.random() * 0.8,
    helderheid: 0.35 + Math.random() * 0.55,
    tijd: Math.random() * 1000,
  });

  function herschaal() {
    ({ breedte, hoogte } = schaalCanvas(canvas, ctx));
    const aantal = Math.round(Math.min(90, Math.max(28, breedte / 16)));
    vonken = Array.from({ length: aantal }, () => nieuweVonk(true));
  }

  function teken(beweeg) {
    ctx.clearRect(0, 0, breedte, hoogte);
    ctx.globalCompositeOperation = "lighter";

    for (const v of vonken) {
      if (beweeg) {
        v.tijd++;
        v.y -= v.snelheid;
        v.x += Math.sin(v.tijd * 0.02 + v.fase) * v.zwaai * 0.4;
      }

      // dichter bij de cursor: feller en een beetje aangetrokken
      const dx = muis.x - v.x;
      const dy = muis.y - v.y;
      const afstand = Math.hypot(dx, dy);
      let nabij = 0;
      if (afstand < AANTREKKING_STRAAL) {
        nabij = 1 - afstand / AANTREKKING_STRAAL;
        if (beweeg) {
          v.x += dx * 0.012 * nabij;
          v.y += dy * 0.012 * nabij;
        }
      }

      const flakkering = 0.65 + 0.35 * Math.sin(v.tijd * 0.15 + v.fase);
      const vervaagBovenaan = Math.min(1, v.y / (hoogte * 0.28));
      const alfa = Math.max(0, Math.min(1, (v.helderheid * flakkering + nabij * 0.6) * vervaagBovenaan));
      const r = v.straal * (1 + nabij * 1.4) * 5;

      const gloed = ctx.createRadialGradient(v.x, v.y, 0, v.x, v.y, r);
      gloed.addColorStop(0, `rgba(255, 228, 165, ${alfa})`);
      gloed.addColorStop(0.3, `rgba(255, 172, 72, ${alfa * 0.5})`);
      gloed.addColorStop(1, "rgba(255, 120, 40, 0)");
      ctx.fillStyle = gloed;
      ctx.beginPath();
      ctx.arc(v.x, v.y, r, 0, Math.PI * 2);
      ctx.fill();

      if (v.y < -20) Object.assign(v, nieuweVonk(false));
    }
    ctx.globalCompositeOperation = "source-over";
  }

  hero.addEventListener("pointermove", (e) => {
    const vak = canvas.getBoundingClientRect();
    muis.x = e.clientX - vak.left;
    muis.y = e.clientY - vak.top;
  });
  hero.addEventListener("pointerleave", () => {
    muis.x = muis.y = -999;
  });

  herschaal();
  if (minderBeweging) teken(false);
  elkFrame(() => zicht.zichtbaar && teken(true));
  bijResize(() => {
    herschaal();
    if (minderBeweging) teken(false);
  });

  // parallax, pas nadat de inzoom-animatie klaar is
  let parallaxAan = false;
  beeld.addEventListener("animationend", () => {
    beeld.style.animation = "none";
    parallaxAan = true;
  });
  bijScrollen(() => {
    if (!parallaxAan || minderBeweging || scrollY > innerHeight * 1.2) return;
    beeld.style.transform = `translate3d(0, ${scrollY * 0.22}px, 0)`;
  });
}
