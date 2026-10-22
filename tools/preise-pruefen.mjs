/* Prüft alle Preise der Website gegen die Tabelle in js/waehrung.js.
   Aufruf: node tools/preise-pruefen.mjs   (Exit-Code 1 bei Fehlern)

   1. Jeder Platzhalter {{preis:schluessel|Ersatz}} in js/*.js: Ersatz = CHF-Text der Tabelle
   2. Jedes <span data-preis="…"> in allen Seiten (alle Sprachen): Inhalt = CHF-Text der Tabelle
   3. Jede Preiskarte [data-plan] auf preise.html: alle data-*-Texte = Tabelle
   4. Kein „CHF“ und keine Zahl wie 1’500 ausserhalb dieser Stellen
      (Ausnahmen: <noscript>-Blöcke, Inhalt der Preiskarten, Währungsumschalter, deutsche Meta-Beschreibung)
   5. Alle Tabellenpreise lassen sich in allen 4 Währungen und Sprachen darstellen */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lies = (p) => fs.readFileSync(path.join(wurzel, p), "utf8");
const fehler = [];
const SPRACHEN = ["de", "en", "fr", "es"];

function tabelle(sprache) {
  const fenster = {};
  const kontext = {
    window: fenster, navigator: { languages: ["de-CH"], language: "de-CH" },
    localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    document: { documentElement: { lang: sprache }, readyState: "complete",
                getElementById: () => null, querySelectorAll: () => [] },
    Intl, console,
  };
  vm.runInNewContext(lies("js/waehrung.js"), kontext);
  return fenster.HDPreis._intern;
}
const tab = Object.fromEntries(SPRACHEN.map((s) => [s, tabelle(s)]));

// 5. Vollständigkeit
for (const s of SPRACHEN) for (const w of tab[s].WAEHRUNGEN) {
  for (const k of Object.keys(tab[s].P)) {
    try { tab[s].preisText(k, w); } catch (e) { fehler.push(`Tabelle ${s}/${w}: ${e.message}`); }
  }
}

// 1. Platzhalter im JavaScript
const TOKEN = /\{\{preis:([\w-]+)\|([^}]*)\}\}/g;
for (const datei of fs.readdirSync(path.join(wurzel, "js")).filter((d) => d.endsWith(".js") && d !== "waehrung.js")) {
  for (const m of lies("js/" + datei).matchAll(TOKEN)) {
    let soll;
    try { soll = tab.de.preisText(m[1], "CHF"); } catch (e) { fehler.push(`js/${datei}: ${e.message}`); continue; }
    if (soll !== m[2]) fehler.push(`js/${datei}: {{preis:${m[1]}}} Ersatztext „${m[2]}“ ≠ Tabelle „${soll}“`);
  }
}

// Seiten aller Sprachen
const seiten = [];
for (const s of SPRACHEN) {
  const ordner = s === "de" ? "" : s + "/";
  if (!fs.existsSync(path.join(wurzel, ordner || "."))) continue;
  for (const d of fs.readdirSync(path.join(wurzel, ordner || "."))) {
    if (d.endsWith(".html")) seiten.push([s, ordner + d]);
  }
}

const entities = (t) => t.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&nbsp;/g, " ");
for (const [s, datei] of seiten) {
  let html = lies(datei);
  // 2. markierte Einzelpreise
  for (const m of html.matchAll(/<span data-preis="([\w-]+)">([^<]*)<\/span>/g)) {
    let soll;
    try { soll = tab[s].preisText(m[1], "CHF"); } catch (e) { fehler.push(`${datei}: ${e.message}`); continue; }
    if (entities(m[2]) !== soll) fehler.push(`${datei}: data-preis="${m[1]}" zeigt „${m[2]}“, Tabelle „${soll}“`);
  }
  // 3. Preiskarten
  for (const m of html.matchAll(/<div class="price-amount" data-plan="([\w-]*)"([^>]*)>/g)) {
    let t;
    try { t = tab[s].paketTexte(m[1], "CHF"); } catch (e) { fehler.push(`${datei}: ${e.message}`); continue; }
    const attr = Object.fromEntries([...m[2].matchAll(/data-([\w-]+)="([^"]*)"/g)].map((a) => [a[1], entities(a[2])]));
    const paare = { "voll-chf": t.vollChf, "voll-sub": t.vollSub, "raten-chf": t.ratenChf,
                    "raten-per": t.ratenPer, "raten-sub": t.ratenSub };
    for (const [k, soll] of Object.entries(paare)) {
      if (attr[k] !== soll) fehler.push(`${datei}: Karte ${m[1]} data-${k} „${attr[k]}“ ≠ Tabelle „${soll}“`);
    }
  }
  // 4. Reste
  const rest = html
    .replace(/<noscript>[\s\S]*?<\/noscript>/g, "")
    .replace(/<select class="cur-switch"[\s\S]*?<\/select>/g, "")   // Währungsumschalter
    .replace(/<div class="price-amount" data-plan[\s\S]*?<\/div>/g, "")
    .replace(/<span data-preis="[\w-]+">[^<]*<\/span>/g, "")
    .replace(s === "de" ? /<meta name="description"[^>]*>/g : /$^/g, "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "")
    .replace(TOKEN, "");
  for (const m of rest.matchAll(/.{0,40}(CHF|\d’\d{3}).{0,40}/g)) {
    fehler.push(`${datei}: Preis ohne Markierung: …${m[0].trim()}…`);
  }
}

// 4b. Reste im JavaScript (ohne Tabelle selbst)
for (const datei of fs.readdirSync(path.join(wurzel, "js")).filter((d) => d.endsWith(".js") && d !== "waehrung.js")) {
  const rest = lies("js/" + datei).replace(TOKEN, "").replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");
  for (const m of rest.matchAll(/.{0,40}\bCHF\b.{0,40}/g)) {
    if (/replace\(\/CHF\/g/.test(m[0])) continue;   // Prüfregel in sprache.js
    fehler.push(`js/${datei}: Preis ohne Platzhalter: …${m[0].trim()}…`);
  }
}

if (fehler.length) {
  console.log(fehler.join("\n"));
  console.log(`\nFEHLER: ${fehler.length} Preis-Probleme.`);
  process.exit(1);
}
console.log(`OK: Preise stimmen (${seiten.length} Seiten, ${Object.keys(tab.de.P).length} Preise × 4 Währungen × 4 Sprachen).`);
