/* ============================================================
   Produktkatalog — baut Übersicht und Detailseite aus produkte-daten.js
   Braucht: produkte-daten.js, produkte-3d.js, produkte-demos.js
   ============================================================ */
(function(){
  "use strict";

  var ICONS = {
    auge:    'M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z|M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
    fenster: 'M3 4h18v16H3zM3 9h18M7 6.5h.01',
    chat:    'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
    bild:    'M3 3h18v18H3zM8.5 8.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm12.5 6.5-5-5L5 21',
    sprache: 'M4 5h11M9 3v2c0 5-2 8-6 9|M6 12c1.5 3 4 5 8 6M12 21l4-9 4 9M13.7 18h4.6',
    wuerfel: 'M12 3l9 5v8l-9 5-9-5V8z|M12 12l9-4M12 12v9M12 12L3 8',
    telefon: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z',
    balken:  'M4 20h16M8 16V9M12 16V5M16 16v-4',
    schild:  'M20.8 11.5a9 9 0 1 1-3.3-6.4|M22 4l-9 9-3-3',
    film:    'M2 5h20v14H2z|m10 9 5 3-5 3z',
    knoten:  'M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z|M6 15V9a3 3 0 0 1 3-3h6M18 9v3a3 3 0 0 1-3 3H9',
    beleg:   'M6 2h12v20l-3-2-3 2-3-2-3 2z|M9 8h6M9 12h6',
    offerte: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z|M14 2v6h6M9 15l2 2 4-4',
    buch:    'M4 19.5V5a2 2 0 0 1 2-2h13v18H6a2 2 0 0 1-2-2.5z|M9 8h7M9 12h5',
    handy:   'M6 2h12v20H6z|M11 18h2',
    daten:   'M12 2c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3z|M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3',
    raster:  'M3 3h18v18H3z|M3 9h18M9 9v12',
    stern:   'M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z',
    hirn:    'M9 3a3 3 0 0 0-3 3 3 3 0 0 0-2 5.2A3 3 0 0 0 6 17a3 3 0 0 0 3 4V3z|M15 3a3 3 0 0 1 3 3 3 3 0 0 1 2 5.2A3 3 0 0 1 18 17a3 3 0 0 1-3 4V3z',
    paragraf:'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z|M12 8v5M12 16h.01',
    kappe:   'M22 9 12 5 2 9l10 4z|M6 11v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5',
    uhr:     'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z|M12 7v5l3 2',
    person:  'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2|M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM22 21v-2a4 4 0 0 0-3-3.9',
    haken:   'M20 6 9 17l-5-5',
    pfeil:   'M5 12h14M13 6l6 6-6 6',
    zurueck: 'M19 12H5M11 18l-6-6 6-6'
  };

  function icon(name){
    var d = ICONS[name] || ICONS.raster;
    var pfade = d.split("|").map(function(p){ return '<path d="' + p + '"/>'; }).join("");
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' + pfade + '</svg>';
  }

  function esc(t){
    return String(t).replace(/[&<>"]/g, function(z){
      return { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[z];
    });
  }

  function stufeVon(nr){
    for (var i = 0; i < STUFEN.length; i++) if (STUFEN[i].id === nr) return STUFEN[i];
    return STUFEN[0];
  }
  function produktVon(id){
    for (var i = 0; i < PRODUKTE.length; i++) if (PRODUKTE[i].id === id) return PRODUKTE[i];
    return null;
  }
  /* Ordnet jedes Produkt einer Auswahl im Kontaktformular zu */
  var KATEGORIE = {
    "google-profil":"Digitale Sichtbarkeit", "website-basis":"Webseiten-Entwicklung", "website-premium":"Webseiten-Entwicklung",
    "betreuungs-abo":"Webseiten-Entwicklung", "chatbot-basis":"Chat & Call-Automatisierung", "telefonassistent":"Chat & Call-Automatisierung",
    "ki-bilder":"Digitale Sichtbarkeit", "uebersetzung":"Digitale Sichtbarkeit", "content-betreuung":"Digitale Sichtbarkeit", "werbevideos":"Digitale Sichtbarkeit",
    "ki-pruefung":"Sonstiges / Beratung", "schulung":"Sonstiges / Beratung"
  };
  function anfrageLink(p){
    var kat = KATEGORIE[p.id] || "Individuelle Lösungen & Apps";
    return "kontakt.html?leistung=" + encodeURIComponent(kat) + "&produkt=" + encodeURIComponent(p.name);
  }

  /* ============================================================
     Übersicht
     ============================================================ */
  function karteHtml(p){
    var ton = stufeVon(p.stufe).ton;
    return '<a class="kp-karte" href="produkt.html?p=' + encodeURIComponent(p.id) + '">' +
      '<span class="kp-karte-kopf">' +
        '<span class="kp-icon" data-ton="' + ton + '">' + icon(p.icon) + '</span>' +
        (p.badge ? '<span class="kp-badge">' + esc(p.badge) + '</span>' : '') +
      '</span>' +
      '<span class="kp-name">' + esc(p.name) + '</span>' +
      '<span class="kp-kurz">' + esc(p.kurz) + '</span>' +
      '<span class="kp-preis">' +
        '<span class="kp-preis-zahl" data-ton="' + ton + '">' + esc(p.preis) + '</span>' +
        (p.preisZusatz ? '<span class="kp-preis-alt">' + esc(p.preisZusatz) + '</span>' : '') +
      '</span>' +
    '</a>';
  }

  function baueUebersicht(ziel){
    var html = "";
    STUFEN.forEach(function(st){
      var liste = PRODUKTE.filter(function(p){ return p.stufe === st.id; });
      if (!liste.length) return;
      var spalten = liste.length === 5 ? "5" : "3";   /* 6 Produkte → zwei Dreierreihen */
      var farbe = st.ton === "gold" ? "var(--gold)" : "var(--blue-bright)";
      html +=
        '<section class="kp-band reveal" data-stufe="' + st.id + '" data-ton="' + st.ton + '">' +
          '<div class="kp-marker">' +
            '<div class="kp-marker-kopf">' +
              '<div class="kp-nr" data-ton="' + st.ton + '">' + (st.id <= 4 ? st.id : icon("uhr")) + '</div>' +
              '<div>' +
                '<div class="kp-stufe-name">' + esc(st.name) + '</div>' +
                '<div class="kp-spanne" style="color:' + farbe + '">' + esc(st.spanne) + '</div>' +
              '</div>' +
            '</div>' +
            '<p class="kp-stufe-ziel">' + esc(st.ziel) + '</p>' +
          '</div>' +
          '<div class="kp-karten" data-spalten="' + spalten + '">' + liste.map(karteHtml).join("") + '</div>' +
        '</section>';
    });
    ziel.innerHTML = html;
    einblenden();
  }

  /* ============================================================
     Detailseite
     ============================================================ */
  function abschnitt(eyebrow, inhalt){
    return '<section class="reveal"><div class="eyebrow">' + esc(eyebrow) + '</div>' + inhalt + '</section>';
  }

  function baueDetail(p){
    var st = stufeVon(p.stufe);
    document.title = p.name + " – Helvetia Digital";
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", p.einzeiler);

    document.getElementById("produktKopf").innerHTML =
      '<div class="container">' +
        '<a class="kp-zurueck" href="produkte.html">' + icon("zurueck") + 'Alle Produkte</a>' +
        '<div class="kp-produkt-kopf-inner">' +
          '<div class="kp-produkt-kopf-text">' +
            '<div style="display:flex;align-items:center;gap:10px;margin-bottom:18px;flex-wrap:wrap">' +
              '<span class="kp-stufe-pille" data-ton="' + st.ton + '">' + esc(st.name) + '</span>' +
              (p.badge ? '<span class="kp-badge">' + esc(p.badge) + '</span>' : '') +
            '</div>' +
            '<h1 style="font-size:clamp(1.9rem,4vw,2.5rem);line-height:1.12;margin-bottom:16px">' + esc(p.name) + '</h1>' +
            '<p style="font-size:1.05rem;line-height:1.65;color:var(--muted);font-weight:350;max-width:460px;margin-bottom:26px">' + esc(p.einzeiler) + '</p>' +
            '<div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">' +
              '<a class="btn-primary" href="' + anfrageLink(p) + '">Angebot anfragen' + icon("pfeil") + '</a>' +
              '<span style="font-family:var(--font-display);font-size:1.25rem;font-weight:700;letter-spacing:-.02em;color:' + (st.ton === "gold" ? "var(--gold)" : "var(--blue-bright)") + '">' + esc(p.preis) +
                (p.preisZusatz ? ' <span style="font-size:.85rem;font-weight:500;color:var(--muted)">' + esc(p.preisZusatz) + '</span>' : '') +
              '</span>' +
            '</div>' +
          '</div>' +
          '<div class="kp-produkt-visual" id="produktVisual"></div>' +
        '</div>' +
      '</div>';

    if (window.KompassObjekt){
      try { window.KompassObjekt(document.getElementById("produktVisual"), p.objekt); } catch (e) {}
    }

    var h = "";

    h += abschnitt("Was das ist",
      '<p style="font-size:1.05rem;line-height:1.72;font-weight:350;max-width:820px">' + esc(p.wasIstDas) + '</p>');

    h += abschnitt("So läuft es ab",
      '<div class="kp-schritte">' + p.schritte.map(function(s, i){
        return '<div class="kp-schritt"><div class="kp-schritt-nr">' + (i + 1) + '</div>' +
               '<h3>' + esc(s[0]) + '</h3><p>' + esc(s[1]) + '</p></div>';
      }).join("") + '</div>');

    if (p.demo){
      h += abschnitt("Live ausprobieren",
        '<h2 style="font-size:1.5rem;margin-bottom:8px">Kein Video — der Ablauf läuft wirklich durch</h2>' +
        '<p style="font-size:.95rem;line-height:1.65;color:var(--muted);font-weight:350;max-width:700px;margin-bottom:22px">' +
        'Drücken Sie auf Start und sehen Sie in zwanzig Sekunden, was passiert.</p>' +
        '<div id="demoZiel"></div>');
    }

    h += abschnitt("Was Sie davon haben",
      '<div class="kp-mehrwert-karte">' +
        '<div class="kp-mehrwert-kopf"><div>' + icon("person") + '</div><h3>Ihr Nutzen</h3></div>' +
        '<div class="kp-punkte">' + p.nutzen.map(function(t){
          return '<div class="kp-punkt-zeile">' + icon("haken") + '<span>' + esc(t) + '</span></div>';
        }).join("") + '</div>' +
      '</div>');

    h += abschnitt("Preis",
      '<div class="kp-preisfelder">' +
        '<div class="kp-preisfeld" data-art="ziel">' +
          '<div class="kp-preisfeld-label">Festpreis</div>' +
          '<div class="kp-preisfeld-zahl">' + esc(p.preis) + '</div>' +
          '<div class="kp-preisfeld-note">' + esc(p.preisZusatz || "Inklusive Einführung und Support. Ratenzahlung möglich.") + '</div>' +
        '</div>' +
        '<div class="kp-preisfeld" style="display:flex;flex-direction:column;justify-content:center;gap:12px">' +
          '<p style="font-size:.95rem;line-height:1.6;color:var(--muted);font-weight:350;margin:0">Im kostenlosen Erstgespräch klären wir, ob dieses Produkt zu Ihrem Vorhaben passt — ehrlich und ohne Verkaufsdruck.</p>' +
          '<a class="btn-ghost" href="termin.html" style="width:fit-content">Erstgespräch buchen</a>' +
        '</div>' +
      '</div>');

    var naechstes = produktVon(p.danach[0]);
    if (naechstes){
      h += '<section class="kp-danach reveal">' +
             '<div style="max-width:620px">' +
               '<div class="kp-res-titel" style="color:var(--gold)">Und danach?</div>' +
               '<h2 style="font-size:1.5rem;margin-bottom:8px">' + esc(naechstes.name) + '</h2>' +
               '<p style="font-size:.95rem;line-height:1.65;color:var(--muted);font-weight:350">' + esc(p.danach[1]) + '</p>' +
             '</div>' +
             '<a class="btn-primary" href="produkt.html?p=' + encodeURIComponent(naechstes.id) + '">Ansehen' + icon("pfeil") + '</a>' +
           '</section>';
    }

    document.getElementById("produktAbschnitte").innerHTML = h;

    if (p.demo && window.KompassDemo){
      var dz = document.getElementById("demoZiel");
      if (dz){ try { window.KompassDemo(dz, p.demo); } catch (e) { dz.remove(); } }
    }
    einblenden();
  }

  /* Nutzt den Einblend-Mechanismus der Website; Sicherheitsnetz falls er nicht greift */
  function einblenden(){
    var alle = document.querySelectorAll(".reveal:not(.in)");
    if (!alle.length) return;
    if (window.IntersectionObserver){
      var beob = new IntersectionObserver(function(eintraege){
        eintraege.forEach(function(e){
          if (e.isIntersecting){ e.target.classList.add("in"); beob.unobserve(e.target); }
        });
      }, { rootMargin: "0px 0px -6% 0px" });
      alle.forEach(function(el){ beob.observe(el); });
      /* Sicherheitsnetz: alles, was im Bild ist, wird spätestens nach 0,9 s sichtbar —
         und beim Scrollen alles, was über die Bildunterkante gewandert ist. */
      function nachziehen(){
        document.querySelectorAll(".reveal:not(.in)").forEach(function(el){
          if (el.getBoundingClientRect().top < window.innerHeight + 40) el.classList.add("in");
        });
      }
      setTimeout(nachziehen, 900);
      window.addEventListener("scroll", nachziehen, { passive: true });
      window.addEventListener("resize", nachziehen, { passive: true });
    } else {
      alle.forEach(function(el){ el.classList.add("in"); });
    }
  }

  document.addEventListener("DOMContentLoaded", function(){
    if (typeof PRODUKTE === "undefined" || typeof STUFEN === "undefined") return;

    var uebersicht = document.getElementById("produkteBaender");
    if (uebersicht){ baueUebersicht(uebersicht); return; }

    var detail = document.getElementById("produktAbschnitte");
    if (detail){
      var id = new URLSearchParams(location.search).get("p");
      var p = id ? produktVon(id) : null;
      if (!p){
        document.getElementById("produktKopf").innerHTML =
          '<div class="container">' +
            '<a class="kp-zurueck" href="produkte.html">' + icon("zurueck") + 'Alle Produkte</a>' +
            '<h1 style="font-size:2rem;margin-bottom:12px">Produkt nicht gefunden</h1>' +
            '<p style="color:var(--muted)">Diesen Eintrag gibt es nicht. In der Übersicht finden Sie alle ' + PRODUKTE.length + ' Produkte.</p>' +
          '</div>';
        return;
      }
      baueDetail(p);
    }
  });
})();
