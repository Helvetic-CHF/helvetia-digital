/* ============================================================
   Helvetia Digital — Geräteerkennung
   Läuft als erstes im <head>, noch vor dem ersten Zeichnen der Seite.
   Erkennt, womit die Seite gerade aufgerufen wird, und schreibt das
   Ergebnis als Attribute auf <html>, damit CSS und die übrigen Skripte
   Format, Grösse und Effekte daran ausrichten können:

     data-geraet       handy | tablet | desktop   (physisches Gerät)
     data-format       schmal | mittel | breit    (aktuelle Fensterbreite)
     data-eingabe      touch | maus               (hauptsächliche Bedienung)
     data-system       ios | android | mac | windows | linux | andere
     data-ausrichtung  hoch | quer
     data-leistung     normal | schwach           (wenig Speicher/Kerne oder Datensparmodus)
     data-netz         schnell | langsam          (Verbindungsqualität, falls bekannt)

   Zusätzlich die CSS-Variable --vh-echt (1 % der tatsächlich sichtbaren
   Höhe, ohne Adressleiste) für Browser ohne dvh-Einheit.

   Zugriff aus anderen Skripten: window.Geraet
     Geraet.typ, .format, .eingabe, .system, .ausrichtung, .leistung, .netz
     Geraet.istHandy / istTablet / istDesktop / istTouch (boolesch)
     Geraet.bei(fn)  → fn wird sofort und bei jeder Änderung aufgerufen
   Ereignis auf window: "geraet:wechsel" (detail = Geraet-Zustand)
   ============================================================ */
(function(){
  "use strict";
  var html = document.documentElement;
  var nav = navigator;
  var ua = nav.userAgent || "";

  /* ————— Einmalige Merkmale (ändern sich nicht während des Besuchs) ————— */

  var touchPunkte = nav.maxTouchPoints || 0;
  var istAndroid = /Android/.test(ua);
  /* iPadOS meldet sich als Mac, hat aber Touch-Punkte (und nennt sich nie Android) */
  var istIpadOS = nav.platform === "MacIntel" && touchPunkte > 1 && !istAndroid;
  var istIOS = /iPhone|iPad|iPod/.test(ua) || istIpadOS;
  /* „Mobile" in der Kennung ist das verlässlichste Zeichen für ein Handy */
  var nenntSichHandy = /Mobile|iPhone|iPod/.test(ua) && !/iPad/.test(ua);

  var system = istIOS ? "ios"
    : istAndroid ? "android"
    : /Mac/.test(nav.platform) ? "mac"
    : /Win/.test(nav.platform) ? "windows"
    : /Linux/.test(nav.platform) ? "linux"
    : "andere";

  var grob = matchMedia("(pointer:coarse)").matches;
  var kannHover = matchMedia("(hover:hover) and (pointer:fine)").matches;
  var istTouch = grob || touchPunkte > 1 || istIOS || istAndroid;
  var eingabe = (istTouch && !kannHover) ? "touch" : "maus";

  /* Grösste Bildschirmkante in CSS-Pixeln – unabhängig von der Drehung */
  var kanteKurz = Math.min(screen.width || 0, screen.height || 0);
  var kanteLang = Math.max(screen.width || 0, screen.height || 0);

  var geraet;
  if (istTouch && !kannHover) {
    /* Reines Touch-Gerät: Handy oder Tablet */
    if (nenntSichHandy) geraet = "handy";
    else if (/iPad/.test(ua) || istIpadOS) geraet = "tablet";
    else geraet = (kanteKurz && kanteKurz < 600) ? "handy" : "tablet";
  } else if (istTouch && kannHover) {
    /* Touch-Bildschirm mit Maus (Laptop, Surface) → Desktop, ausser sehr klein */
    geraet = (kanteLang && kanteLang < 1100) ? "tablet" : "desktop";
  } else {
    geraet = "desktop";
  }

  /* Leistung: wenig Speicher, wenige Kerne oder aktiver Datensparmodus */
  var verbindung = nav.connection || nav.mozConnection || nav.webkitConnection || null;
  var sparen = !!(verbindung && verbindung.saveData);
  var schwach = sparen
    || (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2)
    || (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 2);

  function netzStufe(){
    if (!verbindung) return "schnell";
    if (verbindung.saveData) return "langsam";
    var art = verbindung.effectiveType || "";
    return (/2g|3g/.test(art)) ? "langsam" : "schnell";
  }

  /* ————— Veränderliche Merkmale (Fenstergrösse, Drehung) ————— */

  var zustand = {
    typ: geraet, eingabe: eingabe, system: system,
    leistung: schwach ? "schwach" : "normal", netz: netzStufe(),
    format: "", ausrichtung: "", breite: 0, hoehe: 0,
    istHandy: geraet === "handy", istTablet: geraet === "tablet", istDesktop: geraet === "desktop",
    istTouch: eingabe === "touch", reduzierteBewegung: matchMedia("(prefers-reduced-motion: reduce)").matches
  };

  var zuhoerer = [];

  function messen(){
    var b = window.innerWidth, h = window.innerHeight;
    var format = b < 768 ? "schmal" : b < 1100 ? "mittel" : "breit";
    var ausrichtung = h >= b ? "hoch" : "quer";
    var geaendert = format !== zustand.format || ausrichtung !== zustand.ausrichtung;
    zustand.format = format; zustand.ausrichtung = ausrichtung;
    zustand.breite = b; zustand.hoehe = h;
    zustand.netz = netzStufe();

    html.setAttribute("data-geraet", zustand.typ);
    html.setAttribute("data-format", format);
    html.setAttribute("data-eingabe", zustand.eingabe);
    html.setAttribute("data-system", zustand.system);
    html.setAttribute("data-ausrichtung", ausrichtung);
    html.setAttribute("data-leistung", zustand.leistung);
    html.setAttribute("data-netz", zustand.netz);
    html.style.setProperty("--vh-echt", (h * 0.01).toFixed(2) + "px");

    if (geaendert) {
      zuhoerer.forEach(function(fn){ try { fn(zustand); } catch (e) {} });
      try { window.dispatchEvent(new CustomEvent("geraet:wechsel", { detail: zustand })); } catch (e) {}
    }
  }

  var wartet = false;
  function neuMessen(){
    if (wartet) return;
    wartet = true;
    requestAnimationFrame(function(){ wartet = false; messen(); });
  }

  window.addEventListener("resize", neuMessen, { passive: true });
  window.addEventListener("orientationchange", function(){ setTimeout(messen, 120); }, { passive: true });
  if (window.visualViewport) window.visualViewport.addEventListener("resize", neuMessen, { passive: true });
  if (verbindung && verbindung.addEventListener) verbindung.addEventListener("change", neuMessen);

  messen();

  window.Geraet = {
    get typ(){ return zustand.typ; },
    get format(){ return zustand.format; },
    get eingabe(){ return zustand.eingabe; },
    get system(){ return zustand.system; },
    get ausrichtung(){ return zustand.ausrichtung; },
    get leistung(){ return zustand.leistung; },
    get netz(){ return zustand.netz; },
    get breite(){ return zustand.breite; },
    get hoehe(){ return zustand.hoehe; },
    get istHandy(){ return zustand.istHandy; },
    get istTablet(){ return zustand.istTablet; },
    get istDesktop(){ return zustand.istDesktop; },
    get istTouch(){ return zustand.istTouch; },
    get reduzierteBewegung(){ return zustand.reduzierteBewegung; },
    /* fn sofort und bei jeder Änderung von Format/Ausrichtung aufrufen */
    bei: function(fn){ zuhoerer.push(fn); try { fn(zustand); } catch (e) {} return fn; },
    ab: function(fn){ var i = zuhoerer.indexOf(fn); if (i >= 0) zuhoerer.splice(i, 1); }
  };
})();
