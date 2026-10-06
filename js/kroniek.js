/**
 * Kroniek: de tijdlijn licht op terwijl je scrollt,
 * en de lijn der Pontifexen toont per Pontifex meer uitleg.
 */
import { $, $$, bijScrollen } from "./hulpmiddelen.js";

/** Hoe ver in het scherm (0 = boven, 1 = onder) het "licht" van de tijdlijn staat. */
const ANKER = 0.62;

export function initTijdlijn() {
  const stukken = $$(".moment, .tijdperk.lijn");
  bijScrollen(() => {
    const anker = innerHeight * ANKER;
    for (const stuk of stukken) {
      const vak = stuk.getBoundingClientRect();
      const voortgang = Math.max(0, Math.min(1, (anker - vak.top) / vak.height));
      stuk.style.setProperty("--p", voortgang.toFixed(3));
      stuk.classList.toggle("is-verlicht", anker > vak.top + 20);
    }
  });
}

/** @param {Array} pontifexen  inhoud uit data/pontifexen.json */
export function initPontifexen(pontifexen) {
  const rij = $("#pontifexRij");
  const detail = $("#pfDetail");

  const knoppen = pontifexen.map((p, i) => {
    const knop = document.createElement("button");
    knop.type = "button";
    knop.id = `pf-${i}`;
    knop.className = p.mysterie ? "pf mysterie" : "pf";
    knop.setAttribute("role", "tab");
    knop.setAttribute("aria-controls", "pfDetail");
    knop.innerHTML = `
      <span class="pf-munt" aria-hidden="true">${p.naam[0]}</span>
      <span class="pf-naam">${p.naam}</span>
      <span class="pf-jaar">${p.jaren.replace(" N.A.", "")}</span>`;
    knop.addEventListener("click", () => kies(i));
    rij.appendChild(knop);
    return knop;
  });

  function kies(i) {
    const p = pontifexen[i];
    knoppen.forEach((knop, j) => knop.setAttribute("aria-selected", String(i === j)));
    detail.setAttribute("aria-labelledby", `pf-${i}`);
    detail.innerHTML = `
      <p class="label">${p.titel} · ${p.jaren}</p>
      <h4>Pontifex ${p.naam}</h4>
      <p>${p.tekst}</p>
      ${p.citaat ? `<p class="citaat">${p.citaat}</p>` : ""}`;
  }

  kies(pontifexen.length - 1); // de huidige Pontifex
}
