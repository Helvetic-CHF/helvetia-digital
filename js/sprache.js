/* ============================================================
   Helvetia Digital — Sprache
   - T("deutscher Text") liefert die Übersetzung der Seitensprache
     (Wörterbuch js/i18n/<sprache>.js, erzeugt von tools/sprachen-bauen.py)
   - HD.text(s) = T(s) + Preis-Platzhalter in der aktiven Währung
   - Sprachumschalter behält Adresszusätze (z. B. produkt.html?p=…)
   - Hinweis-Leiste, wenn der Browser eine andere unserer Sprachen bevorzugt
   ============================================================ */
(function(){
  "use strict";

  var SPRACHEN = ["de", "en", "fr", "es"];
  var SPRACHE = (document.documentElement.lang || "de").slice(0, 2);
  var WB = window.HD_I18N || {};
  var TOKEN = /\{\{preis:([\w-]+)\|([^}]*)\}\}/g;

  function hatWorte(s){
    return /[A-Za-zÀ-ÖØ-öø-ÿ]/.test(s.replace(TOKEN, "").replace(/CHF/g, ""));
  }

  function T(s){
    if (SPRACHE === "de" || typeof s !== "string" || !hatWorte(s)) return s;
    if (Object.prototype.hasOwnProperty.call(WB, s)) return WB[s];
    if (window.console) console.warn("[sprache] Übersetzung fehlt:", s);
    return s;
  }

  function text(s){
    var t = T(s);
    if (typeof t !== "string") return t;
    return window.HDPreis ? window.HDPreis.fill(t) : t.replace(TOKEN, "$2");
  }

  window.T = T;
  window.HD = { sprache: SPRACHE, text: text };

  /* ————— Speicher (darf fehlen, z. B. im privaten Modus) ————— */
  function lesen(k){ try { return localStorage.getItem(k); } catch (e) { return null; } }
  function schreiben(k, v){ try { localStorage.setItem(k, v); } catch (e) {} }

  var HINWEIS = {
    de: { text:"Diese Seite gibt es auch auf Deutsch.", knopf:"Auf Deutsch ansehen", zu:"Schliessen" },
    en: { text:"This page is also available in English.", knopf:"View in English", zu:"Close" },
    fr: { text:"Cette page existe aussi en français.", knopf:"Voir en français", zu:"Fermer" },
    es: { text:"Esta página también está disponible en español.", knopf:"Ver en español", zu:"Cerrar" }
  };

  function bevorzugt(){
    var liste = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""];
    for (var i = 0; i < liste.length; i++){
      var s = String(liste[i]).slice(0, 2).toLowerCase();
      if (SPRACHEN.indexOf(s) >= 0) return s;
    }
    return null;
  }

  document.addEventListener("DOMContentLoaded", function(){
    var schalter = document.getElementById("langSwitch");
    if (!schalter) return;
    // Sprachmenü schliessen bei Klick daneben oder Escape
    document.addEventListener("click", function(ev){
      if (schalter.open && !schalter.contains(ev.target)) schalter.open = false;
    });
    document.addEventListener("keydown", function(ev){
      if (ev.key === "Escape" && schalter.open){ schalter.open = false; schalter.querySelector("summary").focus(); }
    });
    var links = {};
    Array.prototype.forEach.call(schalter.querySelectorAll("a[hreflang]"), function(a){
      links[a.getAttribute("hreflang")] = a;
      // Adresszusätze mitnehmen, damit z. B. die Produktdetailseite das Produkt behält
      if (location.search || location.hash) a.href = a.getAttribute("href") + location.search + location.hash;
      a.addEventListener("click", function(){ schreiben("hd-sprache", a.getAttribute("hreflang")); });
    });

    // Hinweis nur, wenn noch nie selbst gewählt oder weggeklickt
    if (lesen("hd-sprache") || lesen("hd-sprache-hinweis")) return;
    var ziel = bevorzugt();
    if (!ziel || ziel === SPRACHE || !links[ziel] || !HINWEIS[ziel]) return;
    var h = HINWEIS[ziel];
    var leiste = document.createElement("div");
    leiste.className = "sprach-hinweis";
    leiste.setAttribute("lang", ziel);
    leiste.setAttribute("role", "region");
    leiste.setAttribute("aria-label", h.text);
    leiste.innerHTML = '<span></span><a class="sprach-hinweis-los"></a><button type="button" class="sprach-hinweis-zu">×</button>';
    leiste.querySelector("span").textContent = h.text;
    var los = leiste.querySelector("a");
    los.textContent = h.knopf;
    los.href = links[ziel].href;
    los.addEventListener("click", function(){ schreiben("hd-sprache", ziel); });
    var zu = leiste.querySelector("button");
    zu.setAttribute("aria-label", h.zu);
    zu.addEventListener("click", function(){ schreiben("hd-sprache-hinweis", "1"); leiste.remove(); });
    document.body.appendChild(leiste);
  });
})();
