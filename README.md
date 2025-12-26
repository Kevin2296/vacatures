# Kerst Verrassingswebsite 🎁✨

Dit is een **kant-en-klaar GitHub Pages** project voor jouw luxe “verrassing” pagina (deel 1 + deel 2 via Streamable).

## Bestanden
- `index.html` – de pagina
- `assets/style.css` – styling/animaties
- `assets/app.js` – logica (video’s, timers, knoppen, confetti)
- `assets/favicon.svg` – favicon

## Video aanpassen
Open `assets/app.js` en pas bovenaan `CONFIG` aan:

```js
const CONFIG = {
  toName: "Kiki",
  fromName: "Kevin",
  video1: { id: "c53lhh", lengthSeconds: 8.0 },
  video2: { id: "uwkejn", lengthSeconds: 15.04 }
};
```

> Let op: omdat Streamable in een iframe draait, kunnen we niet betrouwbaar “video ended” events uitlezen.
> Daarom gebruiken we een timer (`lengthSeconds`) om het “deel 2” banner / eindscherm te tonen.

## Deployen op GitHub Pages (stap-voor-stap)
1. Maak een nieuwe repo (bijv. `kiki-surprise`).
2. Upload **alle bestanden** uit deze map (root).
3. Ga naar **Settings → Pages**.
4. Kies:
   - **Source:** `Deploy from a branch`
   - **Branch:** `main`
   - **Folder:** `/ (root)`
5. Wacht even en open je Pages-URL.

## Waarom zag je “oranje blokjes”?
In jouw originele versie waren dat decoratieve elementen:
- het kleine blokje links in de badge (`.spark`)
- het “zegel” op de envelop (`.seal`)

In deze versie zijn ze **rond + luxer** gemaakt (geen blokjes meer).

Veel plezier 🎄
