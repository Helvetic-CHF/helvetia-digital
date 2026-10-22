/* ============================================================
   Helvetia Digital — Preise in CHF / EUR / GBP / USD
   Hier stehen ALLE Preise der Website in allen vier Währungen.
   Preis ändern = nur diese Tabelle ändern und danach
   python3 tools/preise-pruefen.py laufen lassen (gleicht die
   CHF-Texte im HTML und in den Daten ab).

   Grundsätze
   - Das HTML enthält immer die vollständige CHF-Fassung.
   - Fremdwährung wird „alles oder nichts“ eingesetzt: tritt irgendwo
     ein Fehler auf, bleibt die ganze Seite in CHF und der
     Währungsumschalter bleibt versteckt – nie gemischte Anzeige.
   - Erkennung nur im Browser (Zeitzone + Sprache), keine Daten an Dritte.
   ============================================================ */
(function(){
  "use strict";

  var WAEHRUNGEN = ["CHF", "EUR", "GBP", "USD"];
  var SPEICHER = "hd-waehrung";
  var MWST_CH = 0.081;          // Schweizer MwSt (nur bei CHF ausgewiesen)
  var RATEN_AUFSCHLAG = 1.12;   // 6 Monatsraten: Gesamt = Preis × 1.12
  var RATEN_ANZAHL = 6;

  /* ————— Beträge: [CHF, EUR, GBP, USD] (von BSC freigegeben am 22.10.2026) ————— */
  var B = {
    chatbot:        [243,   259,   219,   299],
    google:         [290,   309,   259,   349],
    uebersetzung:   [450,   479,   409,   549],
    websiteBasis:   [499,   529,   449,   609],
    kiBilder:       [590,   629,   539,   719],
    app:            [599,   639,   549,   729],
    abo:            [190,   199,   169,   229],
    content:        [690,   739,   629,   839],
    clipping:       [990,   1100,  899,   1200],
    premium:        [1010,  1100,  919,   1200],
    videos:         [1200,  1300,  1100,  1500],
    telefon:        [2400,  2600,  2200,  2900],
    telefonMonat:   [290,   309,   259,   349],
    datenKi:        [3500,  3700,  3200,  4300],
    buero:          [4900,  5200,  4500,  6000],
    offerte:        [5500,  5900,  5000,  6700],
    automatisierung:[6500,  7000,  5900,  7900],
    autoMonat:      [200,   209,   179,   239],
    wissen:         [8500,  9100,  7700,  10500],
    modell:         [15000, 16000, 13500, 18500],
    software:       [18000, 19500, 16500, 22000],
    programm:       [25000, 27000, 23000, 30500],
    stufe3Bis:      [12000, 13000, 11000, 14500],
    demoKlein:      [180,   189,   159,   219],
    demoGross:      [340,   359,   309,   409],
    shooting:       [1500,  1600,  1400,  1800],
    anzeigen:       [25,    27,    23,    31],
    clip:           [0.90,  0.96,  0.82,  1.10],
    hosting:        [15,    16,    14,    18]
  };

  /* ————— Darstellungen: Schlüssel → Art + Betrag —————
     fix "CHF 499" · strich "CHF 499.–" · ab "ab CHF 1’200" · monat "CHF 690/Mt."
     abMonat "ab CHF 990/Mt." · plusMonat "+ CHF 290/Mt." · dezimal "CHF 0.90"
     zahl "1’500" (CHF ohne Kürzel, Fremdwährung mit) · spanne "CHF 243 – 590"
     spanneMonat "CHF 190/Mt. – 2’400" */
  var P = {
    "google":              { art:"fix",       b:"google" },
    "website-basis":       { art:"fix",       b:"websiteBasis" },
    "website-basis-strich":{ art:"strich",    b:"websiteBasis" },
    "chatbot":             { art:"fix",       b:"chatbot" },
    "ki-bilder":           { art:"fix",       b:"kiBilder" },
    "uebersetzung":        { art:"fix",       b:"uebersetzung" },
    "premium":             { art:"fix",       b:"premium" },
    "telefon":             { art:"fix",       b:"telefon" },
    "telefon-monat":       { art:"plusMonat", b:"telefonMonat" },
    "content":             { art:"monat",     b:"content" },
    "videos-ab":           { art:"ab",        b:"videos" },
    "clipping-ab":         { art:"abMonat",   b:"clipping" },
    "abo":                 { art:"monat",     b:"abo" },
    "automatisierung":     { art:"fix",       b:"automatisierung" },
    "auto-monat":          { art:"plusMonat", b:"autoMonat" },
    "buero":               { art:"fix",       b:"buero" },
    "offerte":             { art:"fix",       b:"offerte" },
    "wissen":              { art:"fix",       b:"wissen" },
    "app-ab":              { art:"ab",        b:"app" },
    "daten-ab":            { art:"ab",        b:"datenKi" },
    "software-ab":         { art:"ab",        b:"software" },
    "programm-ab":         { art:"ab",        b:"programm" },
    "modell-ab":           { art:"ab",        b:"modell" },
    "pruefung-ab":         { art:"ab",        b:"datenKi" },
    "schulung-ab":         { art:"ab",        b:"videos" },
    "stufe-1":             { art:"spanne",    b:"chatbot", bis:"kiBilder" },
    "stufe-2":             { art:"spanneMonat", b:"abo", bis:"telefon" },
    "stufe-3":             { art:"spanne",    b:"datenKi", bis:"stufe3Bis" },
    "stufe-4":             { art:"ab",        b:"modell" },
    "demo-klein":          { art:"fix",       b:"demoKlein" },
    "demo-gross":          { art:"fix",       b:"demoGross" },
    "shooting-ab":         { art:"ab",        b:"shooting" },
    "dreh":                { art:"zahl",      b:"shooting" },
    "dreh-ab":             { art:"zahl",      b:"videos" },
    "anzeigen":            { art:"fix",       b:"anzeigen" },
    "clip":                { art:"dezimal",   b:"clip" },
    "hosting":             { art:"strich",    b:"hosting" }
  };

  /* Pakete der Seite «Preise» (Einmalzahlung oder 6 Raten) */
  var PAKETE = { "chat-call":{ b:"chatbot" }, "webseiten":{ b:"websiteBasis" }, "individuell":{ b:"app", ab:true } };

  /* ————— Sprachabhängige Texte ————— */
  var SPRACHE = (document.documentElement.lang || "de").slice(0, 2);
  var TX = {
    de: { ab:"ab ", mt:"/Mt.", best:"Bestpreis",
          mwst:"inkl. 8,1% MwSt: {b}", netto:"Nettopreis, zzgl. allfälliger MwSt",
          gesamtMwst:"Gesamt {g} · inkl. MwSt: {m}", gesamtNetto:"Gesamt {g} · zzgl. allfälliger MwSt" },
    en: { ab:"from ", mt:"/mo.", best:"Best price",
          mwst:"incl. 8.1% VAT: {b}", netto:"Net price, plus VAT where applicable",
          gesamtMwst:"Total {g} · incl. VAT: {m}", gesamtNetto:"Total {g} · plus VAT where applicable" },
    fr: { ab:"dès ", mt:"/mois", best:"Meilleur prix",
          mwst:"TVA 8,1 % incl. : {b}", netto:"Prix net, TVA éventuelle en sus",
          gesamtMwst:"Total {g} · TVA incl. : {m}", gesamtNetto:"Total {g} · TVA éventuelle en sus" },
    es: { ab:"desde ", mt:"/mes", best:"Mejor precio",
          mwst:"IVA 8,1 % incl.: {b}", netto:"Precio neto, más IVA si corresponde",
          gesamtMwst:"Total {g} · IVA incl.: {m}", gesamtNetto:"Total {g} · más IVA si corresponde" }
  };
  var tx = TX[SPRACHE] || TX.de;

  /* ————— Zahlen formatieren ————— */
  function gruppiere(ganz, trenner){
    return String(ganz).replace(/\B(?=(\d{3})+(?!\d))/g, trenner);
  }
  /* Zerlegt einen Betrag in Zahl + Währungszeichen davor bzw. dahinter */
  function teile(betrag, w, dezimal){
    var cent = Math.round(betrag * 100);
    var ganz = Math.floor(cent / 100);
    var r = cent % 100;
    var r2 = (r < 10 ? "0" : "") + r;
    if (w === "CHF") return { zahl: gruppiere(ganz, "’") + (dezimal ? "." + r2 : ""), vorne:"CHF ", hinten:"" };
    if (w === "EUR" && SPRACHE !== "en"){
      var t = SPRACHE === "fr" ? " " : ".";
      return { zahl: gruppiere(ganz, t) + (dezimal ? "," + r2 : ""), vorne:"", hinten:" €" };
    }
    var zeichen = { EUR:"€", GBP:"£", USD:"$" }[w];
    return { zahl: gruppiere(ganz, ",") + (dezimal ? "." + r2 : ""), vorne:zeichen, hinten:"" };
  }
  function betrag(b, w, dezimal){
    var t = teile(b, w, dezimal);
    return t.vorne + t.zahl + t.hinten;
  }

  function wert(name, w){
    var reihe = B[name];
    if (!reihe) throw new Error("Unbekannter Betrag: " + name);
    var v = reihe[WAEHRUNGEN.indexOf(w)];
    if (typeof v !== "number") throw new Error("Betrag fehlt: " + name + " " + w);
    return v;
  }

  /* Text eines Preises in Währung w */
  function preisText(schluessel, w){
    var p = P[schluessel];
    if (!p) throw new Error("Unbekannter Preis: " + schluessel);
    var t = teile(wert(p.b, w), w, p.art === "dezimal");
    var voll = t.vorne + t.zahl + t.hinten;
    switch (p.art){
      case "fix": case "dezimal": return voll;
      case "strich":    return w === "CHF" ? "CHF " + t.zahl + ".–" : voll;
      case "ab":        return tx.ab + voll;
      case "monat":     return voll + tx.mt;
      case "abMonat":   return tx.ab + voll + tx.mt;
      case "plusMonat": return "+ " + voll + tx.mt;
      case "zahl":      return w === "CHF" ? t.zahl : voll;
      case "spanne": case "spanneMonat":
        var bis = teile(wert(p.bis, w), w, false);
        var mt = p.art === "spanneMonat" ? tx.mt : "";
        if (t.hinten && !mt) return t.zahl + " – " + bis.zahl + bis.hinten;              // 259 – 629 €
        if (t.hinten) return voll + mt + " – " + bis.zahl + bis.hinten;                 // 199 €/Mt. – 2.600 €
        return voll + mt + " – " + bis.zahl;                                            // CHF 243 – 590
    }
    throw new Error("Unbekannte Preisart: " + p.art);
  }

  /* Texte einer Preiskarte (Seite «Preise») */
  function paketTexte(paket, w){
    var pk = PAKETE[paket];
    if (!pk) throw new Error("Unbekanntes Paket: " + paket);
    var v = wert(pk.b, w);
    var ab = pk.ab ? tx.ab : "";
    var rund = function(x){ return Math.round(x * 100) / 100; };
    var gesamt = rund(v * RATEN_AUFSCHLAG);
    var rate = rund(gesamt / RATEN_ANZAHL);
    var ch = w === "CHF";
    return {
      vollChf:  ab + (ch ? "CHF " + gruppiere(v, "’") + ".–" : betrag(v, w, false)),
      vollSub:  ch ? tx.mwst.replace("{b}", ab + betrag(rund(v * (1 + MWST_CH)), w, true)) : tx.netto,
      ratenChf: RATEN_ANZAHL + "× " + betrag(rate, w, true),
      ratenPer: tx.mt,
      ratenSub: ch ? tx.gesamtMwst.replace("{g}", betrag(gesamt, w, true)).replace("{m}", betrag(rund(gesamt * (1 + MWST_CH)), w, true))
                   : tx.gesamtNetto.replace("{g}", betrag(gesamt, w, true))
    };
  }

  /* ————— Erkennung —————
     Nur ausdrücklich aufgeführte Zeitzonen bestimmen die Währung. Alle anderen
     (z. B. Oslo, Warschau, Toronto) gehen über die Browser-Sprache bzw. die Seitensprache. */
  var ZONEN = {
    CHF: ["Europe/Zurich", "Europe/Vaduz", "Europe/Busingen"],
    EUR: ["Europe/Berlin", "Europe/Vienna", "Europe/Paris", "Europe/Madrid", "Europe/Rome",
          "Europe/Amsterdam", "Europe/Brussels", "Europe/Luxembourg", "Europe/Dublin", "Europe/Lisbon",
          "Europe/Athens", "Europe/Helsinki", "Europe/Mariehamn", "Europe/Tallinn", "Europe/Riga",
          "Europe/Vilnius", "Europe/Bratislava", "Europe/Ljubljana", "Europe/Zagreb", "Europe/Malta",
          "Asia/Nicosia", "Asia/Famagusta", "Europe/Nicosia", "Europe/Sofia", "Europe/Monaco",
          "Europe/San_Marino", "Europe/Vatican", "Europe/Andorra", "Atlantic/Canary", "Atlantic/Madeira",
          "Atlantic/Azores", "Africa/Ceuta"],
    GBP: ["Europe/London", "Europe/Belfast", "Europe/Guernsey", "Europe/Jersey", "Europe/Isle_of_Man",
          "Europe/Gibraltar"],
    USD: ["America/New_York", "America/Detroit", "America/Chicago", "America/Denver", "America/Phoenix",
          "America/Los_Angeles", "America/Anchorage", "America/Juneau", "America/Boise",
          "America/Indiana/Indianapolis", "America/Kentucky/Louisville", "America/Menominee", "America/Nome",
          "America/Sitka", "America/Adak", "Pacific/Honolulu",
          "US/Eastern", "US/Central", "US/Mountain", "US/Pacific", "US/Alaska", "US/Hawaii"]
  };

  function lesen(k){ try { return localStorage.getItem(k); } catch (e) { return null; } }
  function schreiben(k, v){ try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {} }

  function erkenne(){
    var gespeichert = lesen(SPEICHER);
    if (gespeichert && WAEHRUNGEN.indexOf(gespeichert) >= 0) return gespeichert;   // eigene Wahl hat Vorrang
    if (gespeichert) schreiben(SPEICHER, null);                                     // ungültiger Wert → löschen
    var zone = "";
    try { zone = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (e) {}
    for (var i = 0; i < WAEHRUNGEN.length; i++){
      if (ZONEN[WAEHRUNGEN[i]].indexOf(zone) >= 0) return WAEHRUNGEN[i];
    }
    var spr = ((navigator.languages && navigator.languages[0]) || navigator.language || "").toLowerCase();
    if (/^(de|fr|it|rm)-(ch|li)/.test(spr)) return "CHF";
    if (spr === "en-gb") return "GBP";
    if (spr === "en-us") return "USD";
    return SPRACHE === "en" ? "USD" : "EUR";
  }

  /* Prüft beim Laden, dass die Tabelle vollständig ist – sonst bleibt alles CHF */
  function tabelleOk(){
    try {
      Object.keys(P).forEach(function(k){ WAEHRUNGEN.forEach(function(w){ preisText(k, w); }); });
      Object.keys(PAKETE).forEach(function(k){ WAEHRUNGEN.forEach(function(w){ paketTexte(k, w); }); });
      return true;
    } catch (e) {
      if (window.console) console.warn("[waehrung] Tabelle fehlerhaft, bleibe bei CHF:", e.message);
      return false;
    }
  }

  var ok = tabelleOk();
  var aktiv = ok ? erkenne() : "CHF";
  var TOKEN = /\{\{preis:([\w-]+)\|([^}]*)\}\}/g;

  window.HDPreis = {
    waehrung: aktiv,
    text: function(schluessel){ return preisText(schluessel, aktiv); },
    /* Steuerhinweis zu Preisen in Fremdwährung (bei CHF leer – Darstellung wie bisher) */
    mwstHinweis: function(){ return aktiv === "CHF" ? "" : tx.netto; },
    /* Ersetzt {{preis:schluessel|CHF-Ersatztext}} in einem Text */
    fill: function(s){
      return String(s).replace(TOKEN, function(_, k, ersatz){
        try { return preisText(k, aktiv); } catch (e) { return ersatz; }
      });
    },
    /* für tools/preise-pruefen.mjs */
    _intern: { preisText: preisText, paketTexte: paketTexte, P: P, PAKETE: PAKETE, WAEHRUNGEN: WAEHRUNGEN }
  };

  /* ————— Statische Preise im HTML ersetzen (alles oder nichts) ————— */
  function anwenden(){
    var sel = document.getElementById("curSwitch");
    if (!ok) return;
    if (aktiv !== "CHF" || SPRACHE !== "de"){   // Deutsch + CHF = HTML bleibt exakt wie es ist
      try {
        var plan = [];
        document.querySelectorAll("[data-preis]").forEach(function(el){
          plan.push([el, preisText(el.getAttribute("data-preis"), aktiv)]);
        });
        var karten = [];
        document.querySelectorAll("[data-plan]").forEach(function(el){
          karten.push([el, paketTexte(el.getAttribute("data-plan"), aktiv)]);
        });
        // erst jetzt, nachdem alles fehlerfrei berechnet ist, einsetzen
        plan.forEach(function(p){ p[0].textContent = p[1]; });
        karten.forEach(function(k){
          var el = k[0], t = k[1];
          el.dataset.vollChf = t.vollChf; el.dataset.vollSub = t.vollSub;
          el.dataset.ratenChf = t.ratenChf; el.dataset.ratenPer = t.ratenPer; el.dataset.ratenSub = t.ratenSub;
          el.innerHTML = '<span class="chf">' + t.vollChf + '</span>' +
            (el.dataset.vollBest ? '<span class="best">' + tx.best + '</span>' : '') +
            '<span class="sub">' + t.vollSub + '</span>';
        });
      } catch (e) {
        if (window.console) console.warn("[waehrung] Fehler beim Einsetzen, bleibe bei CHF:", e.message);
        window.HDPreis.waehrung = aktiv = "CHF";
        return;   // Umschalter bleibt versteckt, HTML unverändert in CHF
      }
    }
    if (sel){
      sel.value = aktiv;
      sel.hidden = false;
      sel.addEventListener("change", function(){
        schreiben(SPEICHER, sel.value);
        location.reload();
      });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", anwenden);
  else anwenden();
})();
