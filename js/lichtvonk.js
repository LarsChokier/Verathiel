/**
 * "Jouw Lichtvonk": deugden laten de vlam feller branden, zonden verduisteren haar.
 * Doch niemand wordt zonder Licht geboren: de vlam dooft nooit helemaal.
 */
import {
  $,
  $$,
  minderBeweging,
  volgZichtbaarheid,
  schaalCanvas,
  elkFrame,
  bijResize,
} from "./hulpmiddelen.js";

const MIN = 0.1;
const MAX = 1;
const START = 0.55;
const DEUGD_STAP = 0.12;
const ZONDE_STAP = 0.14;

/** De punt van het lampje in de SVG (viewBox 120 × 100), waar de vlam begint. */
const PIT = { x: 106, y: 63, breedte: 120, hoogte: 100 };

function statusTekst(helderheid) {
  if (helderheid <= MIN + 0.001)
    return "Een vonk kan klein worden, doch klein is niet hetzelfde als gedoofd.";
  if (helderheid >= MAX - 0.001)
    return "Je vonk brandt zo helder als zij kan. Waar Licht wordt gedeeld, wordt het niet kleiner maar groter.";
  if (helderheid >= 0.75) return "Je vonk brandt helder.";
  if (helderheid >= 0.45) return "Je vonk brandt rustig.";
  return "Je vonk wordt zwakker. Reik de hand, en zij kan weer gaan schijnen.";
}

export function initLichtvonk() {
  const vak = $("#vonkBeeld");
  const canvas = $("#vonkCanvas");
  const ctx = canvas.getContext("2d");
  const lamp = $("#vonkLamp");
  const status = $("#vonkStatus");
  const meter = $("#meterVulling");
  const zicht = volgZichtbaarheid(vak);

  let breedte = 0;
  let hoogte = 0;
  let pitX = 0;
  let pitY = 0;
  let helderheid = START;
  let doel = START;
  let vlamDeeltjes = [];
  let rook = [];

  function herschaal() {
    ({ breedte, hoogte } = schaalCanvas(canvas, ctx));
    const c = canvas.getBoundingClientRect();
    const l = lamp.getBoundingClientRect();
    pitX = l.left - c.left + l.width * (PIT.x / PIT.breedte);
    pitY = l.top - c.top + l.height * (PIT.y / PIT.hoogte);
  }

  function spuit(aantal, alsVonken) {
    for (let i = 0; i < aantal; i++) {
      if (alsVonken) {
        const hoek = -Math.PI / 2 + (Math.random() - 0.5) * 2.4;
        const snelheid = 1.5 + Math.random() * 3.5;
        vlamDeeltjes.push({
          x: pitX,
          y: pitY - 10,
          vx: Math.cos(hoek) * snelheid,
          vy: Math.sin(hoek) * snelheid,
          leeftijd: 0,
          max: 40 + Math.random() * 30,
          grootte: 2 + Math.random() * 3,
          vonk: true,
        });
      } else {
        rook.push({
          x: pitX + (Math.random() - 0.5) * 8,
          y: pitY - 8,
          vx: (Math.random() - 0.5) * 0.6,
          vy: -0.6 - Math.random() * 0.8,
          leeftijd: 0,
          max: 70 + Math.random() * 40,
          grootte: 5 + Math.random() * 6,
        });
      }
    }
  }

  function tekenHalo(beweeg) {
    const nu = performance.now();
    const flakkering = beweeg ? Math.sin(nu * 0.011) * 0.04 + Math.sin(nu * 0.023) * 0.03 : 0;
    const r = Math.min(34 + helderheid * 150 * (1 + flakkering), breedte * 0.5, pitY + 10);
    const halo = ctx.createRadialGradient(pitX, pitY - 20, 0, pitX, pitY - 20, r);
    halo.addColorStop(0, `rgba(255, 205, 110, ${0.25 + helderheid * 0.4})`);
    halo.addColorStop(0.4, `rgba(255, 160, 60, ${0.08 + helderheid * 0.16})`);
    halo.addColorStop(1, "rgba(255, 140, 50, 0)");
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(pitX, pitY - 20, r, 0, Math.PI * 2);
    ctx.fill();
  }

  function tekenDeeltje(p, t) {
    const grootte = p.vonk ? p.grootte * (1 - t) : p.grootte * (1 - t * 0.75);
    const alfa = (1 - t) * (p.vonk ? 0.9 : 0.55);
    const groen = Math.round(240 - t * 150);
    const blauw = Math.round(190 - t * 170);
    const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, grootte * 2);
    g.addColorStop(0, `rgba(255, ${groen}, ${blauw}, ${alfa})`);
    g.addColorStop(1, `rgba(255, ${groen - 40}, ${Math.max(0, blauw - 40)}, 0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(p.x, p.y, grootte * 2, 0, Math.PI * 2);
    ctx.fill();
  }

  /** Eén frame tekenen. Zonder beweging wordt een stilstaande vlam getekend. */
  function teken(beweeg) {
    if (beweeg) helderheid += (doel - helderheid) * 0.05;
    ctx.clearRect(0, 0, breedte, hoogte);
    tekenHalo(beweeg);

    ctx.globalCompositeOperation = "lighter";
    if (beweeg) {
      const nieuw = 1 + Math.round(helderheid * 4);
      for (let i = 0; i < nieuw; i++) {
        vlamDeeltjes.push({
          x: pitX + (Math.random() - 0.5) * 5 * helderheid,
          y: pitY - 1,
          vx: (Math.random() - 0.5) * 0.35,
          vy: -(0.7 + Math.random() * 1.4) * (0.55 + helderheid * 0.8),
          leeftijd: 0,
          max: 22 + helderheid * 38 + Math.random() * 10,
          grootte: 3 + helderheid * 9,
        });
      }
    } else {
      vlamDeeltjes = Array.from({ length: 26 }, (_, i) => ({
        x: pitX,
        y: pitY - i * (1 + helderheid * 2),
        vx: 0,
        vy: 0,
        leeftijd: i,
        max: 40,
        grootte: (3 + helderheid * 9) * (1 - i / 34),
      }));
    }

    vlamDeeltjes = vlamDeeltjes.filter((p, i) => {
      if (beweeg) {
        p.leeftijd++;
        p.x += p.vx + Math.sin((p.leeftijd + i) * 0.3) * 0.15;
        p.y += p.vy;
        if (p.vonk) {
          p.vy += 0.04;
          p.vx *= 0.98;
        }
      }
      const t = p.leeftijd / p.max;
      if (t >= 1) return false;
      tekenDeeltje(p, t);
      return true;
    });
    if (!beweeg) vlamDeeltjes = [];
    ctx.globalCompositeOperation = "source-over";

    rook = rook.filter((p) => {
      p.leeftijd++;
      p.x += p.vx;
      p.y += p.vy;
      p.grootte += 0.12;
      const t = p.leeftijd / p.max;
      if (t >= 1) return false;
      ctx.fillStyle = `rgba(110, 98, 104, ${(1 - t) * 0.22})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.grootte, 0, Math.PI * 2);
      ctx.fill();
      return true;
    });
  }

  function werkStatusBij() {
    status.textContent = statusTekst(doel);
    meter.style.width = `${Math.round(doel * 100)}%`;
  }

  $$("#deugden .chip, #zonden .chip").forEach((knop) =>
    knop.addEventListener("click", () => {
      const isDeugd = knop.dataset.richting === "deugd";
      doel = Math.max(MIN, Math.min(MAX, doel + (isDeugd ? DEUGD_STAP : -ZONDE_STAP)));
      werkStatusBij();
      if (minderBeweging) {
        helderheid = doel;
        teken(false);
      } else {
        spuit(isDeugd ? 18 : 10, isDeugd);
      }
    }),
  );

  herschaal();
  werkStatusBij();
  if (minderBeweging) teken(false);
  elkFrame(() => zicht.zichtbaar && teken(true));
  bijResize(() => {
    herschaal();
    if (minderBeweging) teken(false);
  });
}
