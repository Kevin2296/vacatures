# Kiki Surprise Site ✨🎁 (v8)

## Fixes in v8
- Cadeau-icon is opnieuw opgebouwd (iOS-ish) en heeft nu een echte "open" easter egg (deksel + strik popt).
- Knop FX werken op **click** (mobiel-proof), niet alleen pointerdown.
- Deel 2 start **iets later** zodat explosies niet 'wegvallen' door iframe reload.
- iPhone bug opgelost: na "Nog een keer" werkt "Open de verrassing" weer (state reset + busy/disabled).

## Video’s aanpassen
In `assets/app.js`:
- `CONFIG.video1.id` + `CONFIG.video1.lengthSeconds`
- `CONFIG.video2.id` + `CONFIG.video2.lengthSeconds`

## Bolletje in badge
`<span class="spark"></span>` is puur decor (glow/pulse).
