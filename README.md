# Verathiel

De website van Verathiel, de theocratie van het Eerste Licht op RepublicMC.

## Online zetten met GitHub Pages

1. Maak een nieuwe repository op GitHub (bv. `verathiel`).
2. Upload **de inhoud** van deze map naar de hoofdmap van de repo: `index.html`, de map `img/` en `.nojekyll`.
   Via de website: *Add file → Upload files*, sleep alles erin en klik op *Commit changes*.
3. Ga naar *Settings → Pages*. Kies bij *Source* voor **Deploy from a branch**, selecteer `main` en `/ (root)` en klik op *Save*.
4. Na een minuutje staat de site op `https://<jouw-gebruikersnaam>.github.io/<repo-naam>/`.

## Linkvoorbeeld in Discord

Bovenaan `index.html` staat `<meta property="og:image" content="img/og.jpg">`.
Vervang dat door het volledige adres, bv. `https://jouwnaam.github.io/verathiel/img/og.jpg`,
dan toont Discord een mooie preview met het wapen als iemand de link deelt.

## Eigen domein (optioneel)

Heb je een domein zoals `verathiel.be`? Vul het in bij *Settings → Pages → Custom domain*
en volg de DNS-instructies van GitHub.

## Wat zit waar

| Bestand | Inhoud |
|---|---|
| `index.html` | De volledige site: opmaak, teksten en interactie in één bestand |
| `img/` | Wapen, screenshots, favicon en linkvoorbeeld |
| `.nojekyll` | Zegt tegen GitHub Pages dat het de bestanden ongewijzigd moet tonen |

Teksten aanpassen? Alles staat in `index.html`. De boeken van de Verlichte Verhalen staan onderaan
in het script, in de lijst `BOEKEN`; de geboden in `GEBODEN` en de pontifexen in `PONTIFEXEN`.
