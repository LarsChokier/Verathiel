/**
 * Verathiel — startpunt van de site.
 * Elk onderdeel van de pagina heeft een eigen module in deze map.
 */
import { $, laadJSON, minderBeweging } from "./hulpmiddelen.js";
import { initThema } from "./thema.js";
import { initNavigatie } from "./navigatie.js";
import { initHero } from "./hero.js";
import { initLichtvonk } from "./lichtvonk.js";
import { initGeboden } from "./geboden.js";
import { initTijdlijn, initPontifexen } from "./kroniek.js";
import { initLantaarn } from "./lantaarn.js";
import { initGalerij } from "./galerij.js";
import { initVerhalen } from "./verhalen.js";
import { initKopieerKnoppen } from "./aansluiten.js";

/* Onderdelen die geen extra inhoud nodig hebben */
initThema();
initNavigatie();
initHero();
initLichtvonk();
initTijdlijn();
initLantaarn();
initGalerij();
initKopieerKnoppen();

/* Onderdelen die hun teksten uit data/ halen */
try {
  const [geboden, pontifexen, boeken] = await Promise.all([
    laadJSON("data/geboden.json"),
    laadJSON("data/pontifexen.json"),
    laadJSON("data/boeken.json"),
  ]);

  const verhalen = initVerhalen(boeken);
  initPontifexen(pontifexen);
  initGeboden(geboden, {
    leesVerhaal(gebod) {
      verhalen.openBoek(1, gebod); // Boek II: De Leer van Aelar
      $("#verhalen").scrollIntoView({ behavior: minderBeweging ? "auto" : "smooth" });
    },
  });
} catch (fout) {
  console.error(fout);
  toonLaadfout();
}

/** Meestal gebeurt dit als je index.html rechtstreeks opent in plaats van via een webserver. */
function toonLaadfout() {
  const melding = document.createElement("p");
  melding.className = "laadfout";
  melding.textContent =
    "De teksten konden niet geladen worden. Open de site via een webserver (zie README.md), niet door index.html dubbel te klikken.";
  $("#lampen").replaceWith(melding.cloneNode(true));
  $("#plank").parentElement.replaceWith(melding);
}
