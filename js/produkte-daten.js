/* ============================================================
   Helvetia Digital — Produktkatalog (öffentliche Fassung)
   Enthält ausschliesslich Inhalte für Kunden. Preise hier ändern.
   ============================================================ */

const STUFEN = [
  { id: 1, name: "Einstieg", spanne: "CHF 243 – 590", ton: "blau",
    ziel: "Schnell umgesetzt, klein im Preis. Sie sehen innert Tagen, wie wir arbeiten — ohne grosse Entscheidung." },
  { id: 2, name: "Aufbau", spanne: "CHF 190/Mt. – 2’400", ton: "blau",
    ziel: "Ihr Auftritt läuft — und wird laufend gepflegt. Hier entsteht Verlässlichkeit: Anrufe werden angenommen, Inhalte bleiben aktuell." },
  { id: 3, name: "Abläufe", spanne: "CHF 3’500 – 12’000", ton: "gold",
    ziel: "Wir übernehmen, was heute Zeit frisst: Anfragen, Offerten, Belege. Ab hier geht es um gesparte Stunden, nicht um Design." },
  { id: 4, name: "Software & Systeme", spanne: "ab CHF 15’000", ton: "gold",
    ziel: "Wenn Standardsoftware nicht mehr passt: gebaut für genau Ihren Betrieb, mit Quellcode und Daten in Ihrer Hand." },
  { id: 5, name: "Beratung & Schulung", spanne: "nach Aufwand", ton: "blau",
    ziel: "Für Fragen, die vor der Umsetzung geklärt sein müssen — was darf Ihr Betrieb mit KI, und was kann Ihr Team damit anfangen?" }
];

const PRODUKTE = [

/* ═══════════ 1 · EINSTIEG ═══════════ */
{
  id: "google-profil", stufe: 1, icon: "auge", objekt: "karte",
  name: "Google-Profil & Sichtbarkeits-Check",
  kurz: "Profil eingerichtet, Einträge korrigiert, Bericht was fehlt.",
  einzeiler: "Ihr Betrieb taucht endlich dort auf, wo Ihre Kunden tatsächlich suchen.",
  preis: "CHF 290",
  wasIstDas: "Die meisten Betriebe haben ein Google-Profil, das irgendwann halb ausgefüllt wurde — falsche Öffnungszeiten, kein Bild, keine Leistungen. Wer Sie sucht, findet Sie nicht oder findet falsche Angaben. Wir räumen das auf: Profil vollständig, Bilder drin, Öffnungszeiten korrekt, Leistungen hinterlegt. Dazu ein kurzer Bericht, wo Ihr Betrieb online sonst noch falsch oder gar nicht auftaucht.",
  schritte: [
    ["Bestand aufnehmen", "Wo taucht Ihr Betrieb heute auf — und mit welchen Angaben?"],
    ["Profil übernehmen", "Wir richten den Zugriff ein oder bestätigen die Inhaberschaft mit Ihnen."],
    ["Vollständig ausfüllen", "Zeiten, Leistungen, Bilder, Beschreibung, Kategorien."],
    ["Bericht übergeben", "Eine Seite: was gemacht wurde, was Sie künftig selbst pflegen können."]
  ],
  demo: "sichtbarkeit",
  nutzen: [
    "Sie werden gefunden, wenn jemand in der Nähe sucht",
    "Richtige Öffnungszeiten — keine verärgerten Kunden vor verschlossener Tür",
    "Anrufe und Routenführung direkt aus dem Suchergebnis",
    "Bewertungen werden sichtbar und beantwortbar"
  ],
  danach: ["website-basis", "Das Profil schickt Leute auf Ihre Website. Wenn die von 2018 ist, verlieren Sie sie dort wieder."]
},
{
  id: "website-basis", stufe: 1, icon: "fenster", objekt: "browser",
  name: "Website Basis",
  kurz: "Bis zu 10 Seiten, mobil, Formular, SEO-Grundlagen.",
  einzeiler: "Ein Auftritt, der in den ersten fünf Sekunden Vertrauen schafft — auf dem Handy genauso wie am Rechner.",
  preis: "CHF 499",
  wasIstDas: "Eine vollständige Website mit bis zu zehn Unterseiten, gestaltet für Ihren Betrieb — kein Baukasten, keine Vorlage von der Stange. Sie lädt schnell, sieht auf dem Handy genauso gut aus wie am Rechner, und sie ist darauf gebaut, dass Besucher anfragen statt nur zu lesen. Impressum, Datenschutz und Cookies sind korrekt umgesetzt.",
  schritte: [
    ["Gespräch & Struktur", "Was soll die Seite erreichen, wer schaut sie an, welche Seiten braucht es?"],
    ["Entwurf zeigen", "Wir bauen die Startseite, Sie sehen sie klickbar, bevor der Rest entsteht."],
    ["Ausbauen & füllen", "Unterseiten, Texte, Bilder, Formulare — Inhalte erarbeiten wir gemeinsam."],
    ["Live schalten", "Domain, Hosting, Google-Anmeldung. Einführung und ein Monat Support inklusive."]
  ],
  demo: "website",
  nutzen: [
    "Sieht auf dem Handy so gut aus wie am Rechner",
    "Anfragen kommen strukturiert per Formular statt als Zuruf",
    "Rechtlich sauber: Impressum, Datenschutz, Cookies",
    "Lädt schnell — Besucher springen nicht ab"
  ],
  danach: ["chatbot-basis", "Die Seite bringt jetzt Anfragen. Die Frage ist, wer sie abends um zehn beantwortet."]
},
{
  id: "chatbot-basis", stufe: 1, icon: "chat", objekt: "chat",
  name: "KI-Chatbot",
  kurz: "Beantwortet die immer gleichen Fragen, rund um die Uhr.",
  einzeiler: "Die fünf Fragen, die jeder stellt, beantwortet er allein — auch nachts und am Sonntag.",
  preis: "CHF 243",
  wasIstDas: "Ein Chatfenster auf Ihrer Website, in dem Besucher fragen können statt anzurufen. Er kennt Öffnungszeiten, Leistungen, Preise und die Anfahrt — alles, was Sie hinterlegen. Was er nicht weiss, sagt er ehrlich und nimmt stattdessen Name und Nummer auf. Er läuft nach Schweizer DSG und DSGVO.",
  schritte: [
    ["Fragen sammeln", "Welche fünf bis zehn Fragen stellen Ihre Kunden immer wieder?"],
    ["Antworten hinterlegen", "In der Sprache Ihres Betriebs, nicht in Werbesprache."],
    ["Auf der Seite einbauen", "Unten rechts, dezent, mit Hinweis dass es kein Mensch ist."],
    ["Nachschärfen", "Nach zwei Wochen schauen wir gemeinsam, was gefragt wurde, und ergänzen."]
  ],
  demo: "chat",
  nutzen: [
    "Weniger Anrufe wegen Kleinigkeiten",
    "Besucher bekommen sofort Antwort, auch nachts",
    "Anfragen landen gesammelt statt verstreut",
    "Datenschutzkonform nach DSG und DSGVO"
  ],
  danach: ["telefonassistent", "Der Chat fängt ab, wer schreibt. Wer anruft, landet weiterhin im Leeren."]
},
{
  id: "ki-bilder", stufe: 1, icon: "bild", objekt: "karte",
  name: "KI-Bilder & Produktfotos",
  kurz: "Produktbilder ohne Fotoshooting. Zehn Motive, druckfertig.",
  einzeiler: "Zehn saubere Produktbilder, ohne dass ein Fotograf kommen muss.",
  preis: "CHF 590",
  wasIstDas: "Aus Ihren vorhandenen Handyfotos oder aus einer Beschreibung entstehen professionell wirkende Produktbilder — freigestellt, gleich ausgeleuchtet, im gleichen Stil. Für Onlineshops, Speisekarten, Broschüren und Social Media. Ein echtes Shooting kostet ab CHF 1’500 und braucht einen Termin.",
  schritte: [
    ["Material sichten", "Was ist vorhanden — Handyfotos, alte Bilder, gar nichts?"],
    ["Stil festlegen", "Hintergrund, Licht, Bildausschnitt — einmal entschieden, dann durchgezogen."],
    ["Erzeugen & auswählen", "Wir erzeugen mehr als nötig, Sie wählen die besten zehn aus."],
    ["Übergeben", "Druckfertig und fürs Web verkleinert, beide Grössen."]
  ],
  demo: "bilder",
  nutzen: [
    "Einheitliche Bilder ohne Fototermin",
    "Ein Drittel vom Preis eines Shootings",
    "In Tagen fertig statt in Wochen",
    "Nachbestellen jederzeit möglich, im gleichen Stil"
  ],
  danach: ["werbevideos", "Wenn die Bilder gut ankommen, ist die nächste Frage fast immer: geht das auch als Video?"]
},
{
  id: "uebersetzung", stufe: 1, icon: "sprache", objekt: "karte",
  name: "Übersetzung & Untertitel",
  kurz: "Video in fünf Sprachen — die Stimme bleibt dieselbe.",
  einzeiler: "Ein Video, fünf Sprachen — und es klingt weiterhin nach Ihnen.",
  preis: "CHF 450",
  wasIstDas: "Ihr vorhandenes Video wird in weitere Sprachen übertragen: Untertitel, oder gleich die gesprochene Fassung — wobei die Stimme des Originalsprechers erhalten bleibt. In der Schweiz mit vier Landessprachen ist das ein naheliegender Schritt, den kaum jemand anbietet.",
  schritte: [
    ["Video annehmen", "Das Original in bester verfügbarer Qualität."],
    ["Text abschreiben", "Automatisch, dann von Hand korrigiert — Fachbegriffe stimmen sonst nicht."],
    ["Übersetzen", "Nicht wörtlich, sondern so wie man es in der Sprache sagen würde."],
    ["Vertonen oder untertiteln", "Je nach Wunsch. Bei Vertonung bleibt Ihre Stimmfarbe erhalten."]
  ],
  demo: "sprache",
  nutzen: [
    "Erreicht Kunden in ihrer eigenen Sprache",
    "Kein neuer Dreh, kein neuer Sprecher",
    "Untertitel bringen zusätzlich Reichweite in sozialen Medien",
    "In zwei Tagen fertig"
  ],
  danach: ["werbevideos", "Wenn die Übersetzung sitzt, fehlt nur noch Nachschub an Videos."]
},

/* ═══════════ 2 · AUFBAU ═══════════ */
{
  id: "website-premium", stufe: 2, icon: "wuerfel", objekt: "browser",
  name: "Website Premium",
  kurz: "Mit Texten, Bildauswahl und Struktur — kein Baukasten.",
  einzeiler: "Die Seite, bei der auch die Texte und Bilder von uns kommen — nicht nur die Technik.",
  preis: "CHF 1’010",
  wasIstDas: "Alles aus der Basis-Website, plus die Arbeit, an der die meisten Projekte hängenbleiben: Texte schreiben, Bilder erzeugen oder auswählen, Struktur durchdenken. Sie müssen nichts liefern ausser einem Gespräch. Dazu Google-Profil, Analyse-Einrichtung und drei Monate Support.",
  schritte: [
    ["Workshop", "Zwei Stunden: Ihr Angebot, Ihre Kunden, Ihr Wettbewerb, Ihre Ziele."],
    ["Struktur & Texte", "Wir schreiben, Sie korrigieren — nicht umgekehrt."],
    ["Bilder erzeugen", "Aus vorhandenem Material oder neu, im einheitlichen Stil."],
    ["Bauen, live schalten, begleiten", "Drei Monate Support statt einem."]
  ],
  demo: "website",
  nutzen: [
    "Sie müssen selbst nichts schreiben und nichts fotografieren",
    "Die Seite ist in vier Wochen fertig statt irgendwann",
    "Texte sind auf Anfragen gebaut, nicht auf Selbstdarstellung",
    "Drei Monate Begleitung nach dem Start"
  ],
  danach: ["betreuungs-abo", "Eine gute Seite veraltet trotzdem. Die Frage ist nur, wer sie pflegt."]
},
{
  id: "telefonassistent", stufe: 2, icon: "telefon", objekt: "telefon", badge: "Beliebt",
  name: "KI-Telefonassistent",
  kurz: "Nimmt Anrufe an, bucht Termine, verpasst nichts.",
  einzeiler: "Ein Mitarbeiter, der ans Telefon geht, wenn niemand sonst kann — und den Termin gleich einträgt.",
  preis: "CHF 2’400", preisZusatz: "+ CHF 290/Mt.",
  wasIstDas: "Eine Telefonnummer, hinter der kein Mensch sitzt, sondern eine Stimme, die zuhört und antwortet. Sie kennt Ihre Öffnungszeiten, Preise und freien Termine. Ruft jemand an, während Sie beim Kunden sind, geht sie ran, klärt das Anliegen und trägt den Termin ein. Danach bekommen Sie eine Nachricht mit dem Besprochenen.",
  schritte: [
    ["Nummer umleiten", "Ihre bestehende Nummer wird weitergeleitet — Sie behalten Ihre Rufnummer."],
    ["Wissen einlesen", "Öffnungszeiten, Leistungen, Preise und häufige Fragen einmal hinterlegen."],
    ["Kalender verbinden", "Der Assistent sieht freie Termine und trägt neue direkt ein."],
    ["Zusammenfassung", "Nach jedem Anruf geht eine kurze Nachricht mit dem Wichtigsten an Sie."]
  ],
  demo: "telefon",
  nutzen: [
    "Kein verpasster Anruf mehr — auch abends, samstags und während der Arbeit",
    "Termine stehen im Kalender, ohne dass jemand etwas abtippt",
    "Jeder Anruf ist nachvollziehbar dokumentiert",
    "Ihr Team wird nicht mehr aus der Arbeit gerissen"
  ],
  danach: ["automatisierung", "Der Assistent nimmt die Anrufe entgegen — aber die Offerte schreiben Sie immer noch selbst."]
},
{
  id: "content-betreuung", stufe: 2, icon: "balken", objekt: "karte",
  name: "Content- & Social-Betreuung",
  kurz: "Posts, Newsletter und Bilder — monatlich, verlässlich.",
  einzeiler: "Ihr Betrieb ist jeden Monat sichtbar, ohne dass jemand bei Ihnen daran denken muss.",
  preis: "CHF 690/Mt.",
  wasIstDas: "Ein festes Paket pro Monat: acht Beiträge für soziale Medien, ein Newsletter, passende Bilder. Themen kommen aus Ihrem Betrieb oder aus einem Jahresplan, den wir einmal gemeinsam aufstellen. Sie geben frei, wir veröffentlichen. Kein Nachfragen, kein Hinterherlaufen.",
  schritte: [
    ["Themenplan", "Einmal für ein Jahr: was passiert wann bei Ihnen, was interessiert Ihre Kunden."],
    ["Monatspaket erstellen", "Texte und Bilder gebündelt, alles auf einmal."],
    ["Freigabe", "Sie sehen alles in einer Übersicht und haken ab."],
    ["Veröffentlichen & auswerten", "Terminiert einstellen, am Monatsende kurz berichten."]
  ],
  demo: "content",
  nutzen: [
    "Regelmässige Sichtbarkeit ohne eigenen Aufwand",
    "Nur noch freigeben statt selbst erstellen",
    "Bilder und Texte passen zum Auftritt Ihrer Website",
    "Monatsbericht: was lief, was nicht"
  ],
  danach: ["werbevideos", "Text und Bild laufen. Videos sind das, was in der Zeitleiste tatsächlich hängenbleibt."]
},
{
  id: "werbevideos", stufe: 2, icon: "film", objekt: "karte",
  name: "Werbe- & Immobilienvideos",
  kurz: "Aus Fotos wird ein Clip. Ein Dreh kostet 1’500 — das hier ab 1’200.",
  einzeiler: "Aus vorhandenen Fotos entsteht ein Video, ohne dass ein Team anrücken muss.",
  preis: "ab CHF 1’200",
  wasIstDas: "Aus Objektfotos, Produktbildern oder einer Beschreibung entsteht ein kurzer Werbeclip mit Kamerabewegung, Musik und Text. Besonders naheliegend bei Immobilien: Für jedes Miet- oder Verkaufsobjekt ein Video, ohne dass jemand mit der Kamera hinfährt. Auch für Gastro, Handwerk und Produkte.",
  schritte: [
    ["Material & Ziel", "Welche Bilder gibt es, wo soll das Video laufen, wie lang?"],
    ["Ablauf festlegen", "Reihenfolge, Text, Musik — auf einer halben Seite abgestimmt."],
    ["Erzeugen", "Mehrere Fassungen, dann die beste weiterbearbeiten."],
    ["Schneiden & liefern", "In den Formaten für Instagram, Website und Inserat."]
  ],
  demo: "video",
  nutzen: [
    "Video für jedes Objekt statt nur fürs Vorzeigeobjekt",
    "Kein Drehteam, kein Termin, keine Wartezeit",
    "Fertig in den Formaten für alle Kanäle",
    "Ein Bruchteil der Kosten eines Drehs"
  ],
  danach: ["content-betreuung", "Ein Video ist ein Video. Erst regelmässig veröffentlicht wird daraus Sichtbarkeit."]
},
{
  id: "betreuungs-abo", stufe: 2, icon: "schild", objekt: "karte",
  name: "Betreuungs-Abo",
  kurz: "Pflege, Inhalte, Google-Profil — Sie müssen nichts tun.",
  einzeiler: "Ihre Seite bleibt aktuell, sicher und auffindbar, ohne dass Sie sich kümmern müssen.",
  preis: "CHF 190/Mt.",
  wasIstDas: "Ein günstiges Monatsabo, das Ihre Website am Leben hält: Änderungen an Texten und Bildern, Aktualisierungen, Sicherungen, Google-Profil pflegen, einmal im Quartal ein kurzer Bericht. Sie rufen nicht mehr wegen einer geänderten Telefonnummer an und warten drei Wochen.",
  schritte: [
    ["Übernahme", "Zugänge, Sicherungen, Überwachung einrichten."],
    ["Laufend", "Kleine Änderungen innert zwei Werktagen, ohne Einzelrechnung."],
    ["Quartalsbericht", "Was wurde gemacht, was empfehlen wir als Nächstes."],
    ["Jährlich", "Einmal im Jahr eine grössere Auffrischung inklusive."]
  ],
  demo: null,
  nutzen: [
    "Änderungen ohne Einzelrechnung und ohne Nachfragen",
    "Seite bleibt sicher und gesichert",
    "Google-Profil bleibt aktuell",
    "Ein Ansprechpartner statt Suche nach dem alten Webdesigner"
  ],
  danach: ["automatisierung", "Wenn die Seite läuft, wird sichtbar, wo im Betrieb sonst noch Zeit verlorengeht."]
},

/* ═══════════ 3 · ABLÄUFE ═══════════ */
{
  id: "automatisierung", stufe: 3, icon: "knoten", objekt: "knoten",
  name: "Automatisierungs-Paket",
  kurz: "Anfragen, Mails und CRM laufen ohne Handarbeit durch.",
  einzeiler: "Was heute jemand von Hand abtippt, läuft ab morgen von allein durch.",
  preis: "CHF 6’500", preisZusatz: "+ CHF 200/Mt.",
  wasIstDas: "Die immer gleichen Handgriffe in Ihrem Betrieb werden verkettet: Eine Anfrage kommt per Mail oder Formular, die Daten landen automatisch im CRM, eine Offerte wird erstellt und Ihnen zur Freigabe vorgelegt, nach dem Versand kommt die Erinnerung von selbst. Sie entscheiden weiterhin — Sie tippen nur nichts mehr ab.",
  schritte: [
    ["Ablauf aufzeichnen", "Einen Tag mitschauen: was macht wer, wie oft, wie lange."],
    ["Die drei teuersten Stellen wählen", "Nicht alles automatisieren — nur was wirklich Zeit frisst."],
    ["Bauen und testen", "Erst parallel zum alten Weg, damit nichts verlorengeht."],
    ["Übergeben", "Schulung, Notfallplan, und wer anruft wenn etwas hängt."]
  ],
  demo: "workflow",
  nutzen: [
    "Zwei Arbeitstage pro Monat zurück — bei gleichem Team",
    "Keine vergessenen Nachfassungen mehr",
    "Anfragen gehen nicht mehr unter",
    "Alles nachvollziehbar dokumentiert"
  ],
  danach: ["kundenportal", "Wenn die Abläufe laufen, wird sichtbar, dass die Software drumherum nicht passt."]
},
{
  id: "buero-automatisierung", stufe: 3, icon: "beleg", objekt: "knoten",
  name: "Büro-Automatisierung",
  kurz: "Buchhaltung, Belege, Protokolle und Mails erledigen sich selbst.",
  einzeiler: "Belege, Protokolle und Mailsortierung laufen im Hintergrund — gesparte Stunden sind verdientes Geld.",
  preis: "CHF 4’900",
  wasIstDas: "Der unsichtbare Teil Ihres Betriebs: Belege werden fotografiert und wandern ausgelesen in die Buchhaltung. Eingehende Mails werden vorsortiert und beantwortet, wo es geht. Aus Besprechungen entstehen automatisch Protokolle mit Aufgabenliste. Nichts davon bringt Umsatz — es spart Abende.",
  schritte: [
    ["Zeitfresser finden", "Wo geht Zeit hin, die niemand verrechnet?"],
    ["Belege & Buchhaltung", "Fotografieren, auslesen, verbuchen — mit Kontrollschritt für Sie."],
    ["Mail & Protokoll", "Vorsortierung, Entwürfe, automatische Besprechungsnotizen."],
    ["Einführen", "Zwei Wochen begleiten wir, bis es zur Gewohnheit wird."]
  ],
  demo: "workflow",
  nutzen: [
    "Belege sind erledigt, bevor der Stapel entsteht",
    "Weniger Abende und Wochenenden mit Papierkram",
    "Protokolle mit Aufgabenliste ohne Mitschreiben",
    "Ihr Treuhänder bekommt sauber vorbereitete Unterlagen"
  ],
  danach: ["offerten-assistent", "Wenn die Ablage läuft, ist die nächste Frage: warum dauert eine Offerte drei Tage?"]
},
{
  id: "offerten-assistent", stufe: 3, icon: "offerte", objekt: "knoten",
  name: "Offerten- & Ausschreibungs-Assistent",
  kurz: "Antwortet auf Ausschreibungen in Stunden statt Tagen.",
  einzeiler: "Mehr Aufträge beim gleichen Team, weil Sie schneller antworten als die Konkurrenz.",
  preis: "CHF 5’500",
  wasIstDas: "Eine Ausschreibung oder Anfrage kommt rein. Der Assistent liest sie, findet in Ihren bisherigen Offerten die passenden Bausteine, rechnet mit Ihren hinterlegten Sätzen und legt einen fertigen Entwurf vor. Sie prüfen, passen an und schicken. Aus drei Tagen werden zwei Stunden — und wer zuerst antwortet, bekommt oft den Auftrag.",
  schritte: [
    ["Altbestand einlesen", "Ihre letzten fünfzig Offerten sind das Wissen des Betriebs."],
    ["Bausteine und Preise", "Textbausteine und Ihre Kalkulationssätze strukturiert hinterlegen."],
    ["Entwurf erzeugen", "Anfrage rein, Entwurf raus — immer mit Prüfschritt für Sie."],
    ["Nachfassen", "Automatische Erinnerung, wenn nach zehn Tagen nichts kommt."]
  ],
  demo: "workflow",
  nutzen: [
    "Sie antworten als Erster — oft der entscheidende Vorteil",
    "Sie können auf mehr Anfragen überhaupt reagieren",
    "Offerten sind einheitlich und vollständig",
    "Nachfassen wird nicht mehr vergessen"
  ],
  danach: ["wissensassistent", "Der Assistent kennt Ihre Offerten. Der nächste Schritt ist: er kennt alles."]
},
{
  id: "wissensassistent", stufe: 3, icon: "buch", objekt: "buch",
  name: "KI-Wissensassistent",
  kurz: "Beantwortet Fragen aus Ihren eigenen Dokumenten — mit Quellenangabe.",
  einzeiler: "Ihr gesamtes Firmenwissen wird durchsuchbar — mit Angabe, wo es steht.",
  preis: "CHF 8’500",
  wasIstDas: "Alle Handbücher, Verträge, Protokolle und Anleitungen Ihres Betriebs werden durchsuchbar gemacht. Ein Mitarbeiter fragt in normaler Sprache — „Wie war die Garantieregelung bei Kunde X?“ — und bekommt die Antwort mit Verweis auf das Dokument und die Seite. Nichts wird erfunden: gibt es die Antwort nicht, sagt der Assistent das.",
  schritte: [
    ["Dokumente sammeln", "Was gibt es, wo liegt es, was ist noch gültig?"],
    ["Aufbereiten", "Alte Stände aussortieren, Struktur herstellen — der Kern der Arbeit."],
    ["Suchbar machen", "Dokumente werden zerlegt und durchsuchbar abgelegt — bei Ihnen oder gehostet."],
    ["Prüfen", "Zwanzig echte Fragen Ihrer Mitarbeiter durchtesten, bevor es freigegeben wird."]
  ],
  demo: "wissen",
  nutzen: [
    "Neue Mitarbeiter finden Antworten selbst",
    "Wissen geht bei Kündigungen nicht verloren",
    "Jede Antwort ist mit Quelle belegt",
    "Nebenbei entsteht eine aufgeräumte Ablage"
  ],
  danach: ["eigenes-modell", "Wenn der Assistent Ihre Dokumente kennt, ist der nächste Schritt ein Modell, das Ihre Sprache spricht."]
},
{
  id: "eigene-app", stufe: 3, icon: "handy", objekt: "handy",
  name: "Eigene App",
  kurz: "iOS und Android, ein Backend, Push-Nachrichten, Veröffentlichung inklusive.",
  einzeiler: "Wenn eine Website nicht mehr reicht — Treueprogramm, Bestellung, interne Abläufe.",
  preis: "ab CHF 599",
  wasIstDas: "Eine echte App für iPhone und Android, mit gemeinsamem Hintergrundsystem. Sinnvoll dort, wo Ihre Kunden wiederkommen: Treuepunkte, Bestellungen, Terminübersicht — oder für interne Abläufe, wo Mitarbeiter unterwegs etwas erfassen müssen. Veröffentlichung in beiden Stores inklusive, drei Monate Support.",
  schritte: [
    ["Zweck schärfen", "Was macht die App, was die Website nicht kann? Ohne klare Antwort raten wir ab."],
    ["Entwurf klickbar", "Alle Bildschirme zum Durchklicken, bevor programmiert wird."],
    ["Bauen", "App und Hintergrundsystem, laufend zum Ausprobieren."],
    ["Veröffentlichen", "Store-Konten, Prüfung, Freigabe — dauert erfahrungsgemäss zwei Wochen."]
  ],
  demo: "app",
  nutzen: [
    "Direkter Draht zum Kunden über Push-Nachrichten",
    "Symbol auf dem Startbildschirm — täglicher Kontakt",
    "Funktionen, die im Browser nicht gehen",
    "Interne Erfassung auch ohne Internetverbindung"
  ],
  danach: ["kundenportal", "Eine App für Kunden ist der halbe Weg. Der ganze ist die Software dahinter."]
},
{
  id: "datenaufbereitung", stufe: 3, icon: "daten", objekt: "knoten",
  name: "Datenaufbereitung für KI",
  kurz: "Chaotische Excel-Listen und Altsysteme werden brauchbar.",
  einzeiler: "Die unsichtbare Vorstufe, ohne die alle anderen KI-Projekte scheitern.",
  preis: "ab CHF 3’500",
  wasIstDas: "Bevor irgendetwas mit KI funktioniert, müssen die Daten stimmen. In der Praxis heisst das: dreissig Excel-Dateien mit Dubletten, ein Altsystem ohne Export, Kundennamen in vier Schreibweisen. Wir räumen das auf, führen zusammen, entfernen Doppelte und machen daraus einen sauberen Bestand. Unspektakulär, aber die Voraussetzung für alles Weitere.",
  schritte: [
    ["Bestand sichten", "Was gibt es wo, in welchem Zustand, wer pflegt es?"],
    ["Zusammenführen", "Alles in eine Struktur, Dubletten erkennen und zusammenlegen."],
    ["Bereinigen", "Schreibweisen vereinheitlichen, Lücken markieren statt raten."],
    ["Bericht", "Was wurde bereinigt, was ist unrettbar, wie bleibt es sauber."]
  ],
  demo: "daten",
  nutzen: [
    "Ein sauberer Datenbestand statt dreissig Listen",
    "Keine doppelten Anschreiben mehr an denselben Kunden",
    "Grundlage für jedes weitere Digitalprojekt",
    "Bericht, wie es sauber bleibt"
  ],
  danach: ["wissensassistent", "Saubere Daten sind da. Jetzt lohnt es sich, sie durchsuchbar zu machen."]
},

/* ═══════════ 4 · SOFTWARE & SYSTEME ═══════════ */
{
  id: "kundenportal", stufe: 4, icon: "raster", objekt: "ebenen",
  name: "Branchen-Software / Kundenportal",
  kurz: "Nach Mass gebaut für genau Ihren Ablauf. Nichts von der Stange.",
  einzeiler: "Software, die genau Ihren Ablauf abbildet — nicht umgekehrt.",
  preis: "ab CHF 18’000",
  wasIstDas: "Eine eigene Anwendung für Ihren Betrieb: Kundenportal, Auftragsverwaltung, Planung — was auch immer der Kern Ihres Geschäfts ist. Standardsoftware zwingt Sie in fremde Abläufe; hier ist es umgekehrt. Mit Zugängen für Mitarbeiter und Kunden, Auswertungen und Anbindung an das, was bei Ihnen schon läuft.",
  schritte: [
    ["Vorprojekt", "Zwei Wochen Analyse: Abläufe, Rollen, Umfang. Danach erst der Festpreis."],
    ["Entwurf", "Alle Bildschirme klickbar, bevor eine Zeile Code entsteht."],
    ["In Abschnitten bauen", "Alle drei Wochen etwas Benutzbares, kein Blindflug über Monate."],
    ["Einführen", "Altdaten übernehmen, Schulung, vier Wochen begleiteter Betrieb."]
  ],
  demo: "portal",
  nutzen: [
    "Software passt zum Betrieb, nicht der Betrieb zur Software",
    "Keine Lizenzgebühren pro Mitarbeiter",
    "Wächst mit — neue Anforderungen sind einbaubar",
    "Quellcode und Daten gehören Ihnen"
  ],
  danach: ["digitalisierungs-programm", "Wenn die Software läuft, gehören Auftritt, Abläufe und Betreuung in einen Vertrag."]
},
{
  id: "digitalisierungs-programm", stufe: 4, icon: "stern", objekt: "ebenen",
  name: "Digitalisierungs-Programm",
  kurz: "Auftritt, Automatisierung, Software und Betreuung als ein Vertrag.",
  einzeiler: "Ein Vertrag über ein Jahr statt fünf Einzelaufträge — planbar für Sie.",
  preis: "ab CHF 25’000", preisZusatz: "über 12 Monate",
  wasIstDas: "Kein Produkt, sondern eine Begleitung: Über zwölf Monate wird Ihr Betrieb Schritt für Schritt digitalisiert — Auftritt, Abläufe, Software, Schulung, Betreuung. Mit festem Monatsbudget, festem Ansprechpartner und einem Fahrplan, der alle drei Monate überprüft wird.",
  schritte: [
    ["Bestandsaufnahme", "Vier Wochen: alle Abläufe, Systeme und Schmerzpunkte erfassen."],
    ["Fahrplan", "Was wird wann angepackt, was bringt es, was kostet es."],
    ["Umsetzen in Abschnitten", "Alle drei Monate ein abgeschlossener Teil, dann Standortbestimmung."],
    ["Übergeben und weiterbetreuen", "Am Ende läuft alles — und die Betreuung läuft weiter."]
  ],
  demo: "portal",
  nutzen: [
    "Ein Ansprechpartner statt fünf Dienstleister",
    "Planbares Monatsbudget statt unerwarteter Rechnungen",
    "Fahrplan mit messbaren Zielen",
    "Alle drei Monate etwas Fertiges statt Warten auf das grosse Ganze"
  ],
  danach: ["kundenportal", "Innerhalb des Programms ist die eigene Software meist der grösste Einzelbaustein."]
},
{
  id: "eigenes-modell", stufe: 4, icon: "hirn", objekt: "ebenen",
  name: "Eigenes KI-Modell anpassen",
  kurz: "Ein Modell lernt die Sprache und das Wissen Ihres Betriebs.",
  einzeiler: "Eine KI, die klingt wie Ihr Betrieb und weiss, was er weiss.",
  preis: "ab CHF 15’000",
  wasIstDas: "Ein vorhandenes Sprachmodell wird auf die Daten Ihres Betriebs angepasst — Fachbegriffe, Tonfall, typische Fälle. Sinnvoll bei sehr eigener Fachsprache oder wenn viele gleichartige Texte entstehen. Ehrlich gesagt: In den meisten Fällen reicht der Wissensassistent — und dann sagen wir das auch.",
  schritte: [
    ["Machbarkeit prüfen", "Reicht der Wissensassistent? Meistens ja. Das klären wir ehrlich, bevor Sie etwas kaufen."],
    ["Trainingsdaten bauen", "Beispielfälle aufbereiten — der weitaus grösste Teil der Arbeit."],
    ["Anpassen und messen", "Mehrere Durchläufe, jedes Mal gegen echte Fälle geprüft."],
    ["Betreiben", "Wo es läuft, wer zugreift, wie es nachtrainiert wird."]
  ],
  demo: "wissen",
  nutzen: [
    "Versteht Ihre Fachsprache verlässlich",
    "Antwortet im Tonfall Ihres Betriebs",
    "Kann vollständig in Ihrem Haus betrieben werden",
    "Die Trainingsdaten bleiben Ihr Eigentum"
  ],
  danach: ["ki-pruefung", "Wer ein eigenes Modell betreibt, braucht die Datenschutzfrage sauber beantwortet."]
},

/* ═══════════ 5 · BERATUNG & SCHULUNG ═══════════ */
{
  id: "ki-pruefung", stufe: 5, icon: "paragraf", objekt: "karte",
  name: "KI-Prüfung & Datenschutz-Beratung",
  kurz: "Was darf Ihr Betrieb mit KI, was nicht — nach Schweizer DSG und DSGVO.",
  einzeiler: "Schriftlich festhalten, was erlaubt ist — bevor jemand im Betrieb Kundendaten irgendwo hineinkopiert.",
  preis: "ab CHF 3’500",
  wasIstDas: "Eine Bestandsaufnahme: Welche KI-Werkzeuge werden in Ihrem Betrieb bereits genutzt — oft ohne dass die Leitung es weiss? Welche Daten fliessen dabei wohin? Was ist nach Schweizer DSG und DSGVO zulässig? Ergebnis ist ein Bericht mit Ampelbewertung, eine Nutzungsrichtlinie für Ihre Mitarbeiter und eine Liste konkreter Massnahmen. Wir prüfen technisch — Rechtsberatung ist ausdrücklich nicht Teil davon.",
  schritte: [
    ["Bestand erheben", "Gespräche und Umfrage: wer nutzt was. Das Ergebnis überrascht die Leitung meist."],
    ["Datenflüsse prüfen", "Welche Daten gehen an welchen Anbieter, unter welchen Bedingungen."],
    ["Bewerten", "Ampel je Werkzeug: unbedenklich, nur mit Auflagen, nicht zulässig."],
    ["Richtlinie & Schulung", "Eine verständliche Seite für Mitarbeiter, plus eine Stunde Erklärung."]
  ],
  demo: "pruefung",
  nutzen: [
    "Sie wissen endlich, was im Betrieb tatsächlich genutzt wird",
    "Klare Regel für Mitarbeiter statt Grauzone",
    "Nachweisbar sorgfältig gehandelt",
    "Konkrete Massnahmenliste statt allgemeiner Warnungen"
  ],
  danach: ["schulung", "Eine Richtlinie, die niemand erklärt hat, wird nicht befolgt."]
},
{
  id: "schulung", stufe: 5, icon: "kappe", objekt: "karte",
  name: "Schulung & Workshop",
  kurz: "Halber Tag „KI im Alltag“ für Ihr Team, an Ihren eigenen Aufgaben.",
  einzeiler: "Ihr Team lernt in einem halben Tag, was wirklich hilft — und was nur Zeit frisst.",
  preis: "ab CHF 1’200",
  wasIstDas: "Ein halber oder ganzer Tag mit Ihrem Team, an konkreten Aufgaben aus deren Alltag — nicht an erfundenen Beispielen. Was hilft wirklich, was ist Zeitverschwendung, wo sind die Grenzen, was darf man mit Kundendaten nicht tun. Jeder geht mit drei Dingen raus, die er am Montag anwenden kann.",
  schritte: [
    ["Vorgespräch", "Eine Stunde: welche Aufgaben, welches Vorwissen, welche Sorgen."],
    ["Anpassen", "Beispiele aus Ihrem Alltag statt aus dem Lehrbuch."],
    ["Durchführen", "Wenig Vortrag, viel selbst ausprobieren."],
    ["Nachfassen", "Kurzanleitung und ein Termin nach vier Wochen."]
  ],
  demo: null,
  nutzen: [
    "Alle im Team auf demselben Stand",
    "Konkrete Beispiele aus dem eigenen Alltag",
    "Klarheit, was mit Kundendaten nicht geht",
    "Jeder geht mit drei anwendbaren Dingen raus"
  ],
  danach: ["buero-automatisierung", "Nach der Schulung wissen alle, was möglich wäre. Jetzt kommt die Frage, wer es einrichtet."]
}

];
