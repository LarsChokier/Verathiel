/**
 * Zon en Maan: wisselen tussen het lichte en het donkere thema,
 * de zandsteentextuur op de achtergrond en de lantaarngloed rond de cursor.
 */
import { $, $$, fijneAanwijzer, minderBeweging } from "./hulpmiddelen.js";

const root = document.documentElement;
const donkerVoorkeur = matchMedia("(prefers-color-scheme: dark)");

export const huidigThema = () =>
  root.getAttribute("data-theme") || (donkerVoorkeur.matches ? "dark" : "light");

function werkLabelsBij() {
  const donker = huidigThema() === "dark";
  const knop = $("#zonmaan");
  knop.setAttribute("aria-label", donker ? "Wissel naar de Zon (licht)" : "Wissel naar de Maan (donker)");
  knop.setAttribute("aria-pressed", String(donker));
  $$("[data-thema-tekst]").forEach((el) => {
    el.textContent = donker ? "Wissel naar de Zon" : "Wissel naar de Maan";
  });
}

function wisselThema() {
  const nieuw = huidigThema() === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", nieuw);
  try {
    localStorage.setItem("verathiel-thema", nieuw);
  } catch {
    /* opslag niet beschikbaar: het thema geldt dan alleen voor dit bezoek */
  }
}

/** Tekent een kleine zandsteentegel van 16×16 pixels en zet die als achtergrond. */
function maakZandsteenTextuur() {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 16;
    const ctx = canvas.getContext("2d");
    let zaad = 11;
    const willekeurig = () => (zaad = (zaad * 16807) % 2147483647) / 2147483647;

    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        const v = willekeurig();
        if (v < 0.42) ctx.fillStyle = `rgba(70, 40, 12, ${(0.018 + willekeurig() * 0.045).toFixed(3)})`;
        else if (v > 0.82) ctx.fillStyle = `rgba(255, 246, 226, ${(0.02 + willekeurig() * 0.05).toFixed(3)})`;
        else continue;
        ctx.fillRect(x, y, 1, 1);
      }
    }
    // twee horizontale lagen, zoals in echt zandsteen
    ctx.fillStyle = "rgba(70, 40, 12, 0.045)";
    ctx.fillRect(0, 4, 16, 1);
    ctx.fillRect(0, 12, 16, 1);

    root.style.setProperty("--textuur", `url(${canvas.toDataURL()})`);
  } catch {
    /* zonder textuur ziet de pagina er ook goed uit */
  }
}

/** Een zachte gloed die de cursor volgt (alleen zichtbaar in het Maan-thema). */
function lantaarnCursor() {
  if (!fijneAanwijzer || minderBeweging) return;
  const gloed = $("#lichtcursor");
  gloed.classList.add("aan");
  addEventListener(
    "pointermove",
    (e) => {
      gloed.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    },
    { passive: true },
  );
}

export function initThema() {
  $("#zonmaan").addEventListener("click", wisselThema);
  $$("[data-wissel-thema]").forEach((knop) => knop.addEventListener("click", wisselThema));

  donkerVoorkeur.addEventListener("change", werkLabelsBij);
  new MutationObserver(werkLabelsBij).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  werkLabelsBij();

  maakZandsteenTextuur();
  lantaarnCursor();
}
