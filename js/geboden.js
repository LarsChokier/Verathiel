/**
 * De Acht Geboden: acht olielampen die je één voor één ontsteekt.
 * De lamp zelf staat als <template id="lampSjabloon"> in index.html.
 */
import { $, $$, ROMEINS, herstartAnimatie } from "./hulpmiddelen.js";

/**
 * @param {Array} geboden      inhoud uit data/geboden.json
 * @param {Object} opties
 * @param {Function} opties.leesVerhaal  opent het verhaal van Aelar bij gebod i
 */
export function initGeboden(geboden, { leesVerhaal }) {
  const rij = $("#lampen");
  const paneel = $("#gebod");
  const sjabloon = $("#lampSjabloon");
  const brandend = new Set([0]);
  let gekozen = 0;

  const lampen = geboden.map((gebod, i) => {
    const lamp = sjabloon.content.firstElementChild.cloneNode(true);
    lamp.id = `lamp-${i}`;
    lamp.setAttribute("aria-label", `Gebod ${ROMEINS[i]}: ${gebod.thema}`);
    lamp.querySelector(".nr").textContent = ROMEINS[i];
    lamp.addEventListener("click", () => kies(i));
    lamp.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      const volgende = (i + (e.key === "ArrowRight" ? 1 : geboden.length - 1)) % geboden.length;
      kies(volgende);
      lampen[volgende].focus();
    });
    rij.appendChild(lamp);
    return lamp;
  });

  function kies(i) {
    gekozen = i;
    brandend.add(i);

    lampen.forEach((lamp, j) => {
      lamp.classList.toggle("brandt", brandend.has(j));
      lamp.setAttribute("aria-selected", String(j === i));
      lamp.tabIndex = j === i ? 0 : -1;
    });

    const gebod = geboden[i];
    $("#gebodNr").textContent = `Gebod ${ROMEINS[i]} · ${gebod.thema}`;
    $("#gebodTekst").textContent = gebod.tekst;
    $("#gebodVerhaal").textContent = gebod.verhaal;
    $("#gebodKern").textContent = gebod.kern;
    paneel.setAttribute("aria-labelledby", `lamp-${i}`);
    herstartAnimatie(paneel, "wissel");

    const aantal = brandend.size;
    const alle = aantal === geboden.length;
    $("#lampenTeller").textContent = alle
      ? "Alle acht lampen branden"
      : `${aantal} van ${geboden.length} lampen ${aantal === 1 ? "brandt" : "branden"}`;
    $("#doof").hidden = aantal < 2;
    $("#alleLampen").hidden = !alle;
    rij.classList.toggle("alle-brandt", alle);
  }

  $("#doof").addEventListener("click", () => {
    brandend.clear();
    kies(gekozen);
  });
  $("#gebodLees").addEventListener("click", () => leesVerhaal(gekozen));

  // beginstand: lamp I brandt al, de tekst ervan staat al in de HTML
  lampen.forEach((lamp, j) => {
    lamp.classList.toggle("brandt", j === 0);
    lamp.setAttribute("aria-selected", String(j === 0));
    lamp.tabIndex = j === 0 ? 0 : -1;
  });
}
