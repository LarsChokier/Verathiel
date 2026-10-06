/**
 * Aansluiten: kopieerknop voor de Discord-link.
 */
import { $$ } from "./hulpmiddelen.js";

export function initKopieerKnoppen() {
  $$("[data-kopieer]").forEach((knop) => {
    const herstel = () => setTimeout(() => (knop.textContent = "kopieer"), 1800);

    // lukt kopiëren niet, dan selecteren we de tekst zodat je zelf kunt kopiëren
    const selecteer = () => {
      const bereik = document.createRange();
      bereik.selectNodeContents(document.getElementById(knop.dataset.doel));
      const selectie = getSelection();
      selectie.removeAllRanges();
      selectie.addRange(bereik);
      knop.textContent = "geselecteerd";
      herstel();
    };

    knop.addEventListener("click", () => {
      if (!navigator.clipboard) return selecteer();
      navigator.clipboard.writeText(knop.dataset.kopieer).then(() => {
        knop.textContent = "gekopieerd";
        herstel();
      }, selecteer);
    });
  });
}
