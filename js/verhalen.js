/**
 * De Verlichte Verhalen: een boekenplank met acht boeken en een lezer.
 * Alle teksten staan in data/boeken.json.
 */
import { $, $$, ROMEINS, minderBeweging, herstartAnimatie } from "./hulpmiddelen.js";

const scrollGedrag = minderBeweging ? "auto" : "smooth";

/** Zet tekst om in een <p>; een enkele regelovergang wordt een <br>. */
function alinea(tekst) {
  const p = document.createElement("p");
  tekst.split("\n").forEach((regel, i) => {
    if (i > 0) p.appendChild(document.createElement("br"));
    p.appendChild(document.createTextNode(regel));
  });
  return p;
}

/**
 * @param {Array} boeken  inhoud uit data/boeken.json
 * @returns {{ openBoek: (boek: number, deel?: number) => void }}
 */
export function initVerhalen(boeken) {
  const plank = $("#plank");
  const inhoud = $("#toc");
  const tekstVak = $("#lezerTekst");
  const vorige = $("#vorige");
  const volgende = $("#volgende");

  let boekIndex = -1;
  let deelIndex = 0;

  const ruggen = boeken.map((boek, i) => {
    const rug = document.createElement("button");
    rug.type = "button";
    rug.id = `rug-${i}`;
    rug.className = "rug";
    rug.setAttribute("role", "tab");
    rug.setAttribute("aria-controls", "lezer");
    rug.setAttribute("aria-label", `Boek ${ROMEINS[i]}: ${boek.titel}`);
    rug.style.setProperty("--kleur", `var(--rug-${boek.rug})`);
    rug.style.setProperty("--h", `${boek.hoogte}px`);
    rug.innerHTML = `
      <span class="rug-nr" aria-hidden="true">${ROMEINS[i]}</span>
      <span class="rug-titel" aria-hidden="true">${boek.kort}</span>
      <svg class="rug-ster" aria-hidden="true"><use href="#ster"/></svg>`;
    rug.addEventListener("click", () => openBoek(i, 0));
    plank.appendChild(rug);
    return rug;
  });

  function toonInhoudstafel(boek) {
    $("#boekNr").textContent = `Boek ${ROMEINS[boekIndex]}`;
    $("#boekTitel").textContent = boek.titel;
    $("#boekSub").textContent = boek.ondertitel;
    inhoud.innerHTML = "";
    boek.delen.forEach((deel, k) => {
      const knop = document.createElement("button");
      knop.type = "button";
      knop.innerHTML = `<span>${ROMEINS[k]}</span>`;
      knop.append(deel.titel);
      knop.addEventListener("click", () => openBoek(boekIndex, k));
      const li = document.createElement("li");
      li.appendChild(knop);
      inhoud.appendChild(li);
    });

    // op mobiel scrolt de plank mee naar het gekozen boek
    const wrap = plank.parentElement;
    if (wrap.scrollWidth > wrap.clientWidth) {
      const rug = ruggen[boekIndex];
      wrap.scrollTo({
        left: rug.offsetLeft - wrap.clientWidth / 2 + rug.offsetWidth / 2,
        behavior: scrollGedrag,
      });
    }
  }

  function toonMoraal(boek, deel) {
    const vak = $("#moraal");
    if (!deel.moraal) {
      vak.hidden = true;
      return;
    }
    vak.innerHTML = '<div class="ornament"><svg aria-hidden="true"><use href="#ster"/></svg></div>';
    const label = deel.moraalLabel || boek.moraalLabel;
    if (label) {
      const p = document.createElement("p");
      p.className = "label";
      p.textContent = label;
      vak.appendChild(p);
    }
    vak.appendChild(alinea(deel.moraal));
    vak.hidden = false;
  }

  function openBoek(b, d = 0) {
    const nieuwBoek = b !== boekIndex;
    boekIndex = b;
    deelIndex = d;
    const boek = boeken[boekIndex];
    const deel = boek.delen[deelIndex];

    ruggen.forEach((rug, j) => rug.setAttribute("aria-selected", String(j === boekIndex)));
    if (nieuwBoek) toonInhoudstafel(boek);

    $$("button", inhoud).forEach((knop, j) => knop.setAttribute("aria-current", String(j === deelIndex)));
    const actief = inhoud.children[deelIndex];
    if (actief && inhoud.scrollWidth > inhoud.clientWidth) {
      inhoud.scrollTo({ left: actief.offsetLeft - 16, behavior: scrollGedrag });
    }

    $("#passageNr").textContent = `${boek.vers ? "Zang" : "Hoofdstuk"} ${ROMEINS[deelIndex]}`;
    $("#passageTitel").textContent = deel.titel;

    const passage = $("#passage");
    passage.innerHTML = "";
    passage.classList.toggle("vers", Boolean(boek.vers));
    deel.tekst.split(/\n\s*\n/).forEach((stuk) => passage.appendChild(alinea(stuk)));

    toonMoraal(boek, deel);
    const naschrift = $("#naMoraal");
    naschrift.hidden = !deel.naschrift;
    naschrift.textContent = deel.naschrift || "";

    $("#positie").textContent = `${deelIndex + 1} / ${boek.delen.length}`;
    const eerste = boekIndex === 0 && deelIndex === 0;
    const laatste = boekIndex === boeken.length - 1 && deelIndex === boek.delen.length - 1;
    vorige.disabled = eerste;
    volgende.disabled = laatste;
    vorige.style.visibility = eerste ? "hidden" : "";
    volgende.style.visibility = laatste ? "hidden" : "";

    herstartAnimatie(tekstVak, "wissel");
  }

  vorige.addEventListener("click", () => {
    if (deelIndex > 0) openBoek(boekIndex, deelIndex - 1);
    else if (boekIndex > 0) openBoek(boekIndex - 1, boeken[boekIndex - 1].delen.length - 1);
  });
  volgende.addEventListener("click", () => {
    if (deelIndex < boeken[boekIndex].delen.length - 1) openBoek(boekIndex, deelIndex + 1);
    else if (boekIndex < boeken.length - 1) openBoek(boekIndex + 1, 0);
  });

  openBoek(0, 0);
  return { openBoek };
}
