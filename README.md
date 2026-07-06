# trawa

A digital capsule wardrobe for people who live out of a suitcase. Capped at a configurable limit (default 33 pieces — a capsule stays a capsule) with per-item weight estimates rolling up to total pack weight. Track every piece of clothing you carry, see every outfit it can make, know exactly how many days you have before laundry becomes urgent, and get honest advice about what to buy — and what to donate.

## What it does

**📷 Fully automated inventory** — Snap or select photos of your clothes (a whole batch at once). Each photo is analyzed by Claude vision: name, category, colors, styles, and how many wears it survives before washing are all filled in automatically — no forms. Requires an Anthropic API key (⚙️ Settings; stored only on your device, roughly a cent per photo).

**✨ Dress me today** — One tap picks the best fully-clean outfit, favoring your least-worn pieces so the whole wardrobe rotates evenly, and logs the wear automatically.

**👗 Wardrobe** — Your inventory with photos. Each item has a category, colors, style tags (casual / smart / sport / beach / evening), and how many wears it survives before washing. Log a wear or a wash with one tap (or add items manually if you prefer).

**✨ Outfits** — Every wearable combination is generated automatically by matching colors (neutrals bridge everything; color families and classic harmonies pair the rest) and overlapping styles. Tap **Wear today** to log wear on every piece of an outfit at once. Filter by style or by "clean pieces only".

**🧺 Laundry runway** — The headline number: *how many days of complete, clean outfits do you have left?* Computed by simulating day-by-day dressing against each item's remaining clean wears. When you hit a laundromat, one tap marks everything clean.

**💡 Insights**
- **Smart shopping list** — Simulates hypothetical purchases (every sensible category × neutral color × your styles) and ranks them by how many *new* outfits they'd unlock and how many stranded pieces they'd rescue.
- **Matches nothing** — Pieces that can't form a single outfit with anything else you own. Buy them a partner, or let them go.
- **Underused** — Items you haven't worn in months (or ever). Wear it this week or donate it.
- **Workhorses** — Your most-worn, most-versatile pieces. Buy more like these.

## How to use it

It's a single self-contained HTML file — no install, no account, no server.

1. Open `index.html` in any browser (works great on a phone).
2. Add your clothes, or tap **Load a sample wardrobe** to explore first.
3. Log wears as you dress; the laundry countdown and insights update live.

Data is saved in your browser's local storage. Use **Export** / **Import** (top right) to back up or move your wardrobe between devices.

> Tip: host it anywhere static (GitHub Pages, Vercel, Netlify) and add it to your phone's home screen for an app-like experience on the road.

## How matching works

- **Neutrals** (black, white, gray, navy, denim, beige, cream, brown, khaki) pair with everything.
- Non-neutral colors pair within their **family** (e.g. blue + teal) and across classic **harmonies** (blue + orange/mustard, pink + green, purple + mustard).
- Two items must also share at least one **style tag** — your running leggings won't be suggested with your silk blouse.
- A core outfit is a top + bottom, or a dress; matching shoes and outerwear attach automatically.
