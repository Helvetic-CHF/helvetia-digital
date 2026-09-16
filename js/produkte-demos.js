/* ============================================================
   Live-Demos — echte Abläufe, keine Videodateien.
   Vier Bauarten, aus denen sich alle Produktfälle ergeben:
   dialog · fluss · vergleich · kacheln
   ============================================================ */
(function(){
  "use strict";

  var HAKEN = '<svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>';
  var PFEIL = '<svg class="kp-pfeil" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  /* ============================================================
     Die Szenarien — hier stehen die Inhalte
     ============================================================ */
  var SZENARIEN = {

    chat: { art:"dialog", titel:"Besucher auf der Website", status:"22:41 Uhr · Sonntag", knopf:"Demo starten",
      label:"Chatverlauf",
      zeilen:[
        ["Besucher","kunde","Haben Sie morgen offen?"],
        ["Assistent","system","Ja, morgen von 8 bis 18:30 Uhr. Möchten Sie einen Termin?"],
        ["Besucher","kunde","Was kostet ein Service?"],
        ["Assistent","system","Der kleine Service kostet CHF 180, der grosse CHF 340. Soll ich Ihnen einen Termin reservieren?"]
      ],
      ergebnis:"Anfrage beantwortet um 22:41 — ohne dass jemand aufstehen musste" },

    telefon: { art:"dialog", titel:"Eingehender Anruf", status:"+41 79 ••• •• 24 · 00:14", knopf:"Anruf annehmen",
      label:"Gesprächsprotokoll",
      zeilen:[
        ["Anrufer","kunde","Guten Tag, haben Sie am Donnerstag noch was frei?"],
        ["Assistent","system","Gerne — Donnerstag hätte ich 14:30 oder 16:00. Was passt Ihnen besser?"],
        ["Anrufer","kunde","Halb drei ist gut."],
        ["Assistent","system","Notiert. Darf ich noch Ihren Namen und eine Nummer für die Bestätigung?"]
      ],
      ergebnis:"Termin eingetragen: Donnerstag 14:30 · Bestätigung per SMS verschickt" },

    wissen: { art:"dialog", titel:"Frage eines Mitarbeiters", status:"Neu im Team, zweite Woche", knopf:"Frage stellen",
      label:"Antwort mit Quelle",
      zeilen:[
        ["Mitarbeiter","kunde","Wie lange gilt bei uns die Garantie auf Ersatzteile?"],
        ["Assistent","system","24 Monate ab Einbaudatum, bei gewerblicher Nutzung 12 Monate.\n\nQuelle: Servicehandbuch 2026, Abschnitt 4.2, Seite 17"],
        ["Mitarbeiter","kunde","Und wenn der Kunde das Teil selbst eingebaut hat?"],
        ["Assistent","system","Dazu steht in den hinterlegten Unterlagen nichts. Bitte bei Herrn Meier nachfragen — ich habe die Frage notiert."]
      ],
      ergebnis:"Antwort mit Fundstelle · offene Frage für die Wissensbasis vermerkt" },

    workflow: { art:"fluss", titel:"Anfrage geht ein", status:"Formular auf der Website", knopf:"Ablauf starten",
      label:"Was automatisch passiert",
      knoten:["Anfrage kommt an","Daten ins CRM","Offerte erzeugt","Zur Freigabe","Versand + Erinnerung"],
      vergleich:[["Von Hand","grau",100,"25 Min."],["Automatisch","gruen",4,"40 Sek."]],
      ergebnis:"Offerte liegt zur Freigabe bereit · 24 Minuten gespart, bei jeder Anfrage" },

    website: { art:"vergleich", titel:"Alte gegen neue Seite", status:"Gemessen auf dem Handy", knopf:"Vergleich starten",
      label:"Was sich ändert",
      balken:[
        ["Ladezeit alt","grau",100,"6,4 Sek."],
        ["Ladezeit neu","gruen",14,"0,9 Sek."],
        ["Anfragen alt","grau",22,"3 / Monat"],
        ["Anfragen neu","blau",78,"11 / Monat"]
      ],
      ergebnis:"Schneller und sichtbarer — dieselben Besucher, mehr Anfragen" },

    sichtbarkeit: { art:"vergleich", titel:"Google-Profil geprüft", status:"Betrieb mit 12 Mitarbeitern", knopf:"Prüfung starten",
      label:"Vollständigkeit",
      balken:[
        ["Vorher","grau",34,"34%"],
        ["Nachher","gruen",96,"96%"],
        ["Aufrufe vorher","grau",28,"210 / Mt."],
        ["Aufrufe nachher","blau",84,"640 / Mt."]
      ],
      ergebnis:"Profil vollständig · dreimal so viele Aufrufe im Suchergebnis" },

    daten: { art:"vergleich", titel:"Datenbestand geprüft", status:"31 Excel-Dateien eingelesen", knopf:"Bereinigung starten",
      label:"Was gefunden wurde",
      balken:[
        ["Datensätze","blau",100,"8’412"],
        ["Dubletten","grau",23,"1’934"],
        ["Ohne Kontakt","grau",11,"902"],
        ["Danach sauber","gruen",77,"6’478"]
      ],
      ergebnis:"Ein sauberer Bestand statt 31 Listen · Grundlage für alles Weitere" },

    pruefung: { art:"vergleich", titel:"KI-Nutzung im Betrieb", status:"Anonyme Umfrage, 24 Mitarbeiter", knopf:"Auswertung zeigen",
      label:"Ampelbewertung",
      balken:[
        ["Unbedenklich","gruen",52,"7 Werkzeuge"],
        ["Nur mit Auflagen","blau",33,"4 Werkzeuge"],
        ["Nicht zulässig","grau",15,"2 Werkzeuge"]
      ],
      ergebnis:"Zwei Werkzeuge mit Kundendaten im Einsatz — der Leitung war keines bekannt" },

    portal: { art:"vergleich", titel:"Erste Woche im Betrieb", status:"Kundenportal, 34 Nutzer", knopf:"Zahlen zeigen",
      label:"Nutzung",
      balken:[
        ["Aufträge erfasst","blau",68,"147"],
        ["Selbstbedienung","gruen",81,"73%"],
        ["Anrufe vorher","grau",100,"52 / Woche"],
        ["Anrufe nachher","gruen",27,"14 / Woche"]
      ],
      ergebnis:"Drei Viertel der Kunden erledigen es selbst · 38 Anrufe weniger pro Woche" },

    bilder: { art:"kacheln", titel:"Aus 3 Handyfotos", status:"Vorlage: Produktbilder vom Kunden", knopf:"Bilder erzeugen",
      label:"Ergebnis", anzahl:8, symbol:"bild",
      ergebnis:"8 einheitliche Produktbilder in 40 Minuten · ein Shooting kostet ab CHF 1’500" },

    video: { art:"kacheln", titel:"Aus Objektfotos", status:"12 Bilder einer Wohnung", knopf:"Video erzeugen",
      label:"Einstellungen", anzahl:6, symbol:"film",
      ergebnis:"Fertiger Clip in drei Formaten · kein Drehteam, kein Termin" },

    content: { art:"kacheln", titel:"Monatspaket", status:"Themenplan Februar", knopf:"Paket erstellen",
      label:"Beiträge zur Freigabe", anzahl:8, symbol:"balken",
      ergebnis:"8 Beiträge und ein Newsletter · der Kunde hakt nur noch ab" },

    app: { art:"kacheln", titel:"App-Bildschirme", status:"Treueprogramm, iOS und Android", knopf:"Durchklicken",
      label:"Ansichten", anzahl:6, symbol:"handy",
      ergebnis:"Push-Nachricht verschickt · Symbol auf dem Startbildschirm des Kunden" },

    clipping: { art:"vergleich", titel:"Ein Beitrag gegen 30 Clips", status:"Gleiches Video, ein Monat", knopf:"Vergleich starten",
      label:"Aufrufe und Kosten",
      balken:[
        ["1 Beitrag","grau",3,"1’400 Aufrufe"],
        ["30 Clips","gruen",100,"48’000 Aufrufe"],
        ["Anzeigen, je 1’000 Aufrufe","grau",100,"CHF 25"],
        ["Clips, je 1’000 Aufrufe","blau",4,"CHF 0.90"]
      ],
      ergebnis:"Dasselbe Material, dreissigfach geschnitten · Aufrufe, die als Anzeige ein Vielfaches kosten würden" },

    sprache: { art:"kacheln", titel:"Ein Video, fünf Sprachen", status:"Original: Deutsch, 2:14 Min.", knopf:"Übersetzen",
      label:"Fassungen", anzahl:5, symbol:"sprache", beschriftung:["DE","FR","IT","EN","ES"],
      ergebnis:"Fünf Fassungen · die Stimme des Sprechers bleibt in allen erhalten" }
  };

  /* ============================================================
     Bauarten
     ============================================================ */

  var SYMBOL = {
    bild:    'M3 3h18v18H3zM8.5 8.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm12.5 6.5-5-5L5 21',
    film:    'M2 5h20v14H2zm8 4 5 3-5 3z',
    balken:  'M4 20h16M8 16V9M12 16V5M16 16v-4',
    handy:   'M6 2h12v20H6zM11 18h2',
    sprache: 'M4 5h11M9 3v2c0 5-2 8-6 9M6 12c1.5 3 4 5 8 6'
  };

  function warte(ms){ return new Promise(function(r){ setTimeout(r, ms); }); }

  /* ---------- dialog ---------- */
  function baueDialog(sz, buehne){
    var html = '<div class="kp-demo-label">' + sz.label + '</div>';
    sz.zeilen.forEach(function(z, i){
      html += '<div class="kp-zeile" data-nr="' + i + '">' +
                '<span class="kp-wer" data-seite="' + z[1] + '">' + z[0] + '</span>' +
                '<div class="kp-blase" data-seite="' + z[1] + '"></div>' +
              '</div>';
    });
    html += '<div class="kp-ergebnis">' + HAKEN + '<span>' + sz.ergebnis + '</span></div>';
    buehne.innerHTML = html;
  }

  async function spieleDialog(sz, buehne, setStatus, abbruch){
    var zeilen = buehne.querySelectorAll(".kp-zeile");
    for (var i = 0; i < sz.zeilen.length; i++){
      if (abbruch()) return;
      var zeile = zeilen[i];
      var blase = zeile.querySelector(".kp-blase");
      var istSystem = sz.zeilen[i][1] === "system";

      zeile.classList.add("da");
      if (istSystem){
        setStatus("Assistent formuliert …");
        blase.innerHTML = '<span class="kp-tippt"><span></span><span></span><span></span></span>';
        await warte(900);
        if (abbruch()) return;
      } else {
        setStatus("Gegenüber spricht …");
      }
      blase.textContent = "";
      blase.style.whiteSpace = "pre-line";
      var text = sz.zeilen[i][2];
      for (var z = 0; z < text.length; z++){
        if (abbruch()) return;
        blase.textContent += text[z];
        if (z % 3 === 0) await warte(14);
      }
      await warte(420);
    }
    if (abbruch()) return;
    setStatus("Abgeschlossen");
    buehne.querySelector(".kp-ergebnis").classList.add("da");
  }

  /* ---------- fluss ---------- */
  function baueFluss(sz, buehne){
    var html = '<div class="kp-demo-label">' + sz.label + '</div><div class="kp-fluss">';
    sz.knoten.forEach(function(k, i){
      if (i) html += PFEIL;
      html += '<div class="kp-knoten" data-nr="' + i + '">' + k + '</div>';
    });
    html += '</div>';
    if (sz.vergleich){
      html += '<div class="kp-demo-label" style="margin-top:18px">Zeitaufwand im Vergleich</div><div class="kp-vergleich">';
      sz.vergleich.forEach(function(b){
        html += '<div class="kp-balken-zeile"><span>' + b[0] + '</span>' +
                '<div class="kp-balken-bahn"><div class="kp-balken-fuell" data-ton="' + b[1] + '" data-breite="' + b[2] + '"></div></div>' +
                '<span class="kp-balken-wert">' + b[3] + '</span></div>';
      });
      html += '</div>';
    }
    html += '<div class="kp-ergebnis">' + HAKEN + '<span>' + sz.ergebnis + '</span></div>';
    buehne.innerHTML = html;
  }

  async function spieleFluss(sz, buehne, setStatus, abbruch){
    var knoten = buehne.querySelectorAll(".kp-knoten");
    for (var i = 0; i < knoten.length; i++){
      if (abbruch()) return;
      setStatus(sz.knoten[i] + " …");
      knoten[i].classList.add("aktiv");
      await warte(750);
      if (abbruch()) return;
      knoten[i].classList.remove("aktiv");
      knoten[i].classList.add("fertig");
      await warte(140);
    }
    if (abbruch()) return;
    buehne.querySelectorAll(".kp-balken-fuell").forEach(function(f){
      f.style.width = f.dataset.breite + "%";
    });
    await warte(700);
    if (abbruch()) return;
    setStatus("Abgeschlossen");
    buehne.querySelector(".kp-ergebnis").classList.add("da");
  }

  /* ---------- vergleich ---------- */
  function baueVergleich(sz, buehne){
    var html = '<div class="kp-demo-label">' + sz.label + '</div><div class="kp-vergleich">';
    sz.balken.forEach(function(b, i){
      html += '<div class="kp-balken-zeile"><span>' + b[0] + '</span>' +
              '<div class="kp-balken-bahn"><div class="kp-balken-fuell" data-nr="' + i + '" data-ton="' + b[1] + '" data-breite="' + b[2] + '"></div></div>' +
              '<span class="kp-balken-wert" data-nr="' + i + '">—</span></div>';
    });
    html += '</div><div class="kp-ergebnis">' + HAKEN + '<span>' + sz.ergebnis + '</span></div>';
    buehne.innerHTML = html;
  }

  async function spieleVergleich(sz, buehne, setStatus, abbruch){
    for (var i = 0; i < sz.balken.length; i++){
      if (abbruch()) return;
      setStatus(sz.balken[i][0] + " …");
      buehne.querySelector('.kp-balken-fuell[data-nr="' + i + '"]').style.width = sz.balken[i][2] + "%";
      buehne.querySelector('.kp-balken-wert[data-nr="' + i + '"]').textContent = sz.balken[i][3];
      await warte(620);
    }
    if (abbruch()) return;
    setStatus("Abgeschlossen");
    buehne.querySelector(".kp-ergebnis").classList.add("da");
  }

  /* ---------- kacheln ---------- */
  function baueKacheln(sz, buehne){
    var pfad = SYMBOL[sz.symbol] || SYMBOL.bild;
    var html = '<div class="kp-demo-label">' + sz.label + '</div><div class="kp-kacheln">';
    for (var i = 0; i < sz.anzahl; i++){
      var inhalt = sz.beschriftung
        ? '<span style="font-family:var(--font-display);font-weight:650;font-size:15px;color:var(--blue-bright)">' + sz.beschriftung[i] + '</span>'
        : '<svg viewBox="0 0 24 24"><path d="' + pfad + '"/></svg>';
      html += '<div class="kp-kachel" data-nr="' + i + '">' + inhalt + '</div>';
    }
    html += '</div><div class="kp-ergebnis">' + HAKEN + '<span>' + sz.ergebnis + '</span></div>';
    buehne.innerHTML = html;
  }

  async function spieleKacheln(sz, buehne, setStatus, abbruch){
    var kacheln = buehne.querySelectorAll(".kp-kachel");
    for (var i = 0; i < kacheln.length; i++){
      if (abbruch()) return;
      setStatus("Erzeuge " + (i + 1) + " von " + sz.anzahl + " …");
      kacheln[i].classList.add("da");
      await warte(430);
    }
    if (abbruch()) return;
    setStatus("Abgeschlossen");
    buehne.querySelector(".kp-ergebnis").classList.add("da");
  }

  var BAUER  = { dialog:baueDialog,   fluss:baueFluss,   vergleich:baueVergleich,   kacheln:baueKacheln };
  var SPIELER= { dialog:spieleDialog, fluss:spieleFluss, vergleich:spieleVergleich, kacheln:spieleKacheln };

  /* ============================================================
     Öffentliche Funktion
     ============================================================ */
  window.KompassDemo = function(behaelter, name){
    var sz = SZENARIEN[name];
    if (!sz) return null;

    var lauf = 0;

    var el = document.createElement("div");
    el.className = "kp-demo";
    el.innerHTML =
      '<div class="kp-demo-steuer">' +
        '<div class="kp-puls"><span></span><span></span><span></span>' +
          '<svg viewBox="0 0 24 24"><path d="M13 2 3 14h9l-1 8 10-12h-9z"/></svg>' +
        '</div>' +
        '<div>' +
          '<div class="kp-demo-titel">' + sz.titel + '</div>' +
          '<div class="kp-demo-status">' + sz.status + '</div>' +
        '</div>' +
        '<button type="button" class="btn-primary" style="padding:10px 24px;font-size:13.5px">' + sz.knopf + '</button>' +
      '</div>' +
      '<div class="kp-demo-buehne"></div>';

    var buehne = el.querySelector(".kp-demo-buehne");
    var knopf  = el.querySelector("button");
    var status = el.querySelector(".kp-demo-status");

    function aufbauen(){
      BAUER[sz.art](sz, buehne);
    }
    function setStatus(t){ status.textContent = t; }

    knopf.addEventListener("click", async function(){
      var meins = ++lauf;
      function abbruch(){ return meins !== lauf; }

      aufbauen();
      el.classList.add("laeuft");
      knopf.textContent = "Nochmal";
      knopf.disabled = true;

      try {
        await SPIELER[sz.art](sz, buehne, setStatus, abbruch);
      } catch (e) {
        setStatus("Demo abgebrochen");
      }

      if (!abbruch()){
        el.classList.remove("laeuft");
        knopf.disabled = false;
      }
    });

    aufbauen();
    behaelter.appendChild(el);
    return el;
  };
})();
