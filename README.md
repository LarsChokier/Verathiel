# Verathiel

De website van Verathiel, de theocratie van het Eerste Licht op RepublicMC.

## Mappenstructuur

```
verathiel-website/
├── index.html            De pagina zelf (alleen opbouw en vaste teksten)
├── css/
│   └── style.css         Alle opmaak, met een inhoudstafel bovenaan
├── js/
│   ├── main.js           Startpunt: laadt alle onderdelen en de data
│   ├── hulpmiddelen.js   Gedeelde hulpfuncties (selectors, animatielus, JSON laden)
│   ├── thema-vooraf.js   Zet Zon/Maan al vóór de pagina getekend wordt
│   ├── bestand-melding.js  Melding als je index.html als los bestand opent
│   ├── thema.js          Zon/Maan-schakelaar, zandsteentextuur, lantaarncursor
│   ├── navigatie.js      Menu en actief onderdeel
│   ├── hero.js           Lichtvonken en parallax bovenaan
│   ├── lichtvonk.js      "Jouw Lichtvonk" met deugden en zonden
│   ├── geboden.js        De acht olielampen
│   ├── kroniek.js        Tijdlijn en lijn der Pontifexen
│   ├── lantaarn.js       Boek der Schaduwen met de lantaarn
│   ├── galerij.js        Fotogalerij en vergroting
│   ├── verhalen.js       Boekenplank en lezer
│   └── aansluiten.js     Kopieerknop voor de Discord-link
├── data/
│   ├── boeken.json       De Verlichte Verhalen (alle acht boeken)
│   ├── geboden.json      De Acht Geboden en de verhalen van Aelar
│   └── pontifexen.json   De lijn der Pontifexen
├── img/                  Wapen, screenshots, favicon en linkvoorbeeld
└── .nojekyll             Zegt tegen GitHub Pages dat het niets mag omzetten
```

## Teksten aanpassen

- **Lore uit de boeken, geboden of pontifexen:** pas het juiste bestand in `data/` aan.
  In `boeken.json` heeft elk hoofdstuk een `titel`, een `tekst` en meestal een `moraal`
  (de uitgelichte slotzin). Een lege regel (`\n\n`) begint een nieuwe alinea, één `\n` een nieuwe regel.
- **Kroniek, rangen, Aansluiten en andere vaste teksten:** staan rechtstreeks in `index.html`.
- **Kleuren en lettertypes:** bovenaan `css/style.css`, in het blok `:root`.
  De Maan-kleuren staan er net onder.

## Lokaal bekijken

Omdat de site JavaScript-modules en JSON gebruikt, werkt ze niet als je `index.html` gewoon dubbelklikt.
Start een kleine webserver in deze map, bijvoorbeeld:

- **VS Code:** installeer de extensie *Live Server* en klik op *Go Live*.
- **Python:** `python -m http.server` en open daarna `http://localhost:8000`.

Op GitHub Pages werkt alles vanzelf.

## Online zetten met GitHub Pages

1. Maak een nieuwe repository op GitHub (bv. `verathiel`).
2. Upload **de inhoud** van deze map naar de hoofdmap van de repo (dus `index.html`, `css/`, `js/`, `data/`, `img/` en `.nojekyll`).
   Via de website: *Add file → Upload files*, sleep alles erin en klik op *Commit changes*.
   `.nojekyll` is een verborgen bestand; zie je het niet, zet dan verborgen bestanden aan of maak het op GitHub aan via *Add file → Create new file*.
3. Ga naar *Settings → Pages*. Kies bij *Source* voor **Deploy from a branch**, selecteer `main` en `/ (root)` en klik op *Save*.
4. Na een minuutje staat de site op `https://<jouw-gebruikersnaam>.github.io/<repo-naam>/`.

## Linkvoorbeeld in Discord

Bovenaan `index.html` staat `<meta property="og:image" content="img/og.jpg">`.
Vervang dat door het volledige adres, bv. `https://jouwnaam.github.io/verathiel/img/og.jpg`,
dan toont Discord een preview met het wapen als iemand de link deelt.

## Eigen domein (optioneel)

Heb je een domein zoals `verathiel.be`? Vul het in bij *Settings → Pages → Custom domain*
en volg de DNS-instructies van GitHub.
