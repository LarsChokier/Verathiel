/**
 * De Stad: fotogalerij met een lichtbak (vergroting).
 * Werkt met klikken, pijltjestoetsen, Escape en swipen.
 */
import { $, $$ } from "./hulpmiddelen.js";

export function initGalerij() {
  const tegels = $$("#galerij .foto");
  const lichtbak = $("#lichtbak");
  const beeld = $("#lbImg");
  const onderschrift = $("#lbCap");

  // de grote versie van elke foto heeft dezelfde naam zonder "-klein"
  const fotos = tegels.map((tegel) => {
    const img = $("img", tegel);
    return {
      src: img.getAttribute("src").replace("-klein", ""),
      alt: img.alt,
      tekst: $(".onderschrift", tegel).textContent,
    };
  });

  let huidige = 0;
  let terugNaar = null;
  let geveegd = false;
  let veegStart = null;

  function toon(i) {
    huidige = (i + fotos.length) % fotos.length;
    const foto = fotos[huidige];
    beeld.src = foto.src;
    beeld.alt = foto.alt;
    onderschrift.textContent = foto.tekst;
  }

  function open(i, bron) {
    terugNaar = bron;
    toon(i);
    lichtbak.hidden = false;
    document.body.style.overflow = "hidden";
    $("#lbSluit").focus();
  }

  function sluit() {
    lichtbak.hidden = true;
    document.body.style.overflow = "";
    terugNaar?.focus();
  }

  tegels.forEach((tegel, i) => tegel.addEventListener("click", () => open(i, tegel)));
  $("#lbSluit").addEventListener("click", sluit);
  $("#lbVorige").addEventListener("click", () => toon(huidige - 1));
  $("#lbVolgende").addEventListener("click", () => toon(huidige + 1));

  lichtbak.addEventListener("click", (e) => {
    if (geveegd) {
      geveegd = false;
      return;
    }
    if (e.target === lichtbak || e.target.tagName === "FIGURE") sluit();
  });

  document.addEventListener("keydown", (e) => {
    if (lichtbak.hidden) return;
    if (e.key === "Escape") sluit();
    else if (e.key === "ArrowRight") toon(huidige + 1);
    else if (e.key === "ArrowLeft") toon(huidige - 1);
    else if (e.key === "Tab") houdFocusBinnen(e);
  });

  function houdFocusBinnen(e) {
    const knoppen = $$("button", lichtbak).filter((k) => k.offsetParent);
    const index = knoppen.indexOf(document.activeElement);
    if (e.shiftKey && index <= 0) {
      e.preventDefault();
      knoppen.at(-1).focus();
    } else if (!e.shiftKey && index === knoppen.length - 1) {
      e.preventDefault();
      knoppen[0].focus();
    }
  }

  lichtbak.addEventListener("pointerdown", (e) => {
    veegStart = e.clientX;
  });
  lichtbak.addEventListener("pointerup", (e) => {
    if (veegStart === null) return;
    const verschil = e.clientX - veegStart;
    if (Math.abs(verschil) > 50) {
      geveegd = true;
      toon(huidige + (verschil < 0 ? 1 : -1));
    }
    veegStart = null;
  });
}
