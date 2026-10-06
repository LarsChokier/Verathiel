/**
 * Boek der Schaduwen: een donkere sectie waarin een lantaarn de tekst onthult.
 * Zonder muis zweeft de lantaarn vanzelf rond.
 */
import { $, minderBeweging, volgZichtbaarheid, elkFrame } from "./hulpmiddelen.js";

export function initLantaarn() {
  const sectie = $("#schaduw");
  const lichtLaag = $("#lantaarnLicht");
  const zicht = volgZichtbaarheid(sectie);

  if (minderBeweging) {
    sectie.classList.add("statisch");
    return;
  }

  let x = 0;
  let y = 0;
  let doelX = 0;
  let doelY = 0;
  let volgtMuis = false;
  let gestart = false;

  function richtOp(e) {
    const vak = sectie.getBoundingClientRect();
    doelX = e.clientX - vak.left;
    doelY = e.clientY - vak.top;
    volgtMuis = true;
  }
  sectie.addEventListener("pointermove", richtOp);
  sectie.addEventListener("pointerdown", richtOp);
  sectie.addEventListener("pointerleave", () => {
    volgtMuis = false;
  });

  function zet(px, py) {
    const s = sectie.getBoundingClientRect();
    const l = lichtLaag.getBoundingClientRect();
    sectie.style.setProperty("--gx", `${px}px`);
    sectie.style.setProperty("--gy", `${py}px`);
    lichtLaag.style.setProperty("--x", `${px - (l.left - s.left)}px`);
    lichtLaag.style.setProperty("--y", `${py - (l.top - s.top)}px`);
  }

  elkFrame((tijd) => {
    if (!zicht.zichtbaar) return;
    const vak = sectie.getBoundingClientRect();
    if (!gestart) {
      x = vak.width / 2;
      y = vak.height / 2;
      gestart = true;
    }
    if (!volgtMuis) {
      doelX = vak.width / 2 + Math.sin(tijd * 0.00042) * vak.width * 0.3;
      doelY = vak.height / 2 + Math.sin(tijd * 0.00071 + 1) * vak.height * 0.2;
    }
    const zachtheid = volgtMuis ? 0.16 : 0.04;
    x += (doelX - x) * zachtheid;
    y += (doelY - y) * zachtheid;
    zet(x, y);
  });
}
