/*
 * Opent iemand index.html rechtstreeks (als bestand), dan werken de modules en
 * de teksten uit data/ niet. Deze melding legt uit hoe het wel moet.
 * Op GitHub Pages of via een lokale webserver verschijnt ze nooit.
 */
if (location.protocol === "file:") {
  document.addEventListener("DOMContentLoaded", () => {
    const melding = document.createElement("p");
    melding.className = "bestand-melding";
    melding.textContent =
      "Je opent de site als los bestand. Start een lokale webserver (zie README.md) om alles te zien.";
    document.body.prepend(melding);
  });
}
