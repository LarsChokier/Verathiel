/*
 * Laadt het gekozen thema (Zon of Maan) vóór de pagina getekend wordt,
 * zodat de site niet even in het verkeerde thema oplicht.
 */
try {
  const thema = localStorage.getItem("verathiel-thema");
  if (thema === "dark" || thema === "light") document.documentElement.setAttribute("data-theme", thema);
} catch {
  /* geen opslag beschikbaar */
}
