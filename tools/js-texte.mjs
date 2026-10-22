/* Sammelt alle Texte, die das JavaScript übersetzt anzeigt, und gibt sie als JSON-Liste aus.
   Wird von tools/sprachen-bauen.py aufgerufen. Quellen:
   - STUFEN / PRODUKTE aus js/produkte-daten.js
   - SZENARIEN aus js/produkte-demos.js
   - jedes T("…") in js/*.js und in Inline-Skripten der Seiten
   Was hier als Kennung gilt, muss dazu passen, was js/produkte.js und
   js/produkte-demos.js (Funktion uebersetze) übersetzen. */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lies = (p) => fs.readFileSync(path.join(wurzel, p), "utf8");
const texte = new Set();

const PREIS_TOKEN = /\{\{preis:[^}]*\}\}/g;
const hatWorte = (s) => /[A-Za-zÀ-ÖØ-öø-ÿ]/.test(s.replace(PREIS_TOKEN, "").replace(/CHF/g, ""));

// Felder ohne sichtbaren Text (Kennungen, Farben, Rollen)
const OHNE_TEXT = new Set(["id", "icon", "objekt", "ton", "demo", "art", "symbol", "beschriftung", "seite"]);

function sammle(wert, schluessel) {
  if (OHNE_TEXT.has(schluessel)) return;
  if (typeof wert === "string") { if (hatWorte(wert)) texte.add(wert); return; }
  if (Array.isArray(wert)) { wert.forEach((w) => sammle(w, null)); return; }
  if (wert && typeof wert === "object") for (const k of Object.keys(wert)) sammle(wert[k], k);
}

// Produktdaten
const daten = vm.runInNewContext(lies("js/produkte-daten.js") + "\n;({ STUFEN, PRODUKTE })");
daten.STUFEN.forEach((s) => sammle(s, null));
daten.PRODUKTE.forEach((p) => {
  const kopie = { ...p, danach: p.danach ? p.danach[1] : null };  // danach[0] ist eine Produkt-ID
  sammle(kopie, null);
});

// Demo-Szenarien (die Rolle in zeilen[i][1] und der Farbton in balken[i][1] sind Kennungen)
const fenster = {};
vm.runInNewContext(lies("js/produkte-demos.js"), { window: fenster, document: {}, Promise, setTimeout });
const szenarien = fenster.KompassDemo.SZENARIEN;
for (const sz of Object.values(szenarien)) {
  const kopie = { ...sz };
  for (const feld of ["zeilen", "balken", "vergleich"]) {
    if (kopie[feld]) kopie[feld] = kopie[feld].map((z) => z.filter((_, i) => i !== 1));
  }
  sammle(kopie, null);
}

// T("…")-Aufrufe
const T_AUFRUF = /\bT\(\s*(?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)')\s*\)/g;
function tAufrufe(quelle) {
  quelle = quelle.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");   // Kommentare ignorieren
  for (const m of quelle.matchAll(T_AUFRUF)) {
    const roh = m[1] !== undefined ? m[1] : m[2];
    const text = JSON.parse('"' + roh.replace(/\\'/g, "'").replace(/(?<!\\)"/g, '\\"') + '"');
    if (hatWorte(text)) texte.add(text);
  }
}
for (const datei of fs.readdirSync(path.join(wurzel, "js"))) {
  if (datei.endsWith(".js")) tAufrufe(lies("js/" + datei));
}
for (const datei of fs.readdirSync(wurzel)) {
  if (!datei.endsWith(".html")) continue;
  for (const m of lies(datei).matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) tAufrufe(m[1]);
}

process.stdout.write(JSON.stringify([...texte].sort()));
