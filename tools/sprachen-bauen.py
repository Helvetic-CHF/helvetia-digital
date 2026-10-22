#!/usr/bin/env python3
"""
Helvetia Digital — Sprachversionen erzeugen (EN / FR / ES)

Quelle sind die deutschen Seiten im Hauptordner. Das Skript
  1. füllt in allen Seiten die Bereiche SPRACHWAHL, HREFLANG und I18N,
  2. schreibt en/, fr/, es/ mit übersetzten Kopien,
  3. schreibt js/i18n/<sprache>.js (Texte für das JavaScript).

Übersetzt wird nur, was in i18n/texte.json steht – Schlüssel ist der exakte
deutsche Text, dazu {"en": …, "fr": …, "es": …}. Texte, die in allen Sprachen
gleich bleiben (Namen, Adressen), stehen in i18n/gleich.json. Fehlt eine
Übersetzung oder ist eine überflüssig, bricht das Skript ab und schreibt nichts.

Aufruf:   python3 tools/sprachen-bauen.py            (bauen)
          python3 tools/sprachen-bauen.py --fehlende (nur fehlende Texte auflisten)
"""
import html as htmlmod
import json
import os
import re
import subprocess
import sys

WURZEL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SEITEN = ["index.html", "leistungen.html", "produkte.html", "produkt.html", "preise.html",
          "website-check.html", "ueber-uns.html", "kontakt.html", "termin.html", "datenschutz.html"]
SPRACHEN = ["en", "fr", "es"]
ALLE = ["de"] + SPRACHEN
BASIS_URL = "https://helvetic-chf.github.io/helvetia-digital/"
VERSION = "20261022b"

# Attribute mit sichtbarem bzw. vorgelesenem Text
TEXT_ATTRIBUTE = {"alt", "title", "aria-label", "placeholder",
                  "data-voll-chf", "data-voll-sub", "data-raten-chf", "data-raten-sub", "data-raten-per"}
# Meta-Tags, deren content übersetzt wird
META_NAMEN = {"description", "og:title", "og:description", "twitter:title", "twitter:description"}

SPRACHNAMEN = {"de": "Deutsch", "en": "English", "fr": "Français", "es": "Español"}
# Kleine Texte des Sprach-/Währungsumschalters (werden hier erzeugt, nicht aus den Seiten gelesen)
UMSCHALTER = {
    "de": {"sprache": "Sprache wählen", "waehrung": "Währung wählen"},
    "en": {"sprache": "Choose language", "waehrung": "Choose currency"},
    "fr": {"sprache": "Choisir la langue", "waehrung": "Choisir la devise"},
    "es": {"sprache": "Elegir idioma", "waehrung": "Elegir moneda"},
}

TOKEN = re.compile(r"(<!--.*?-->|<script\b[^>]*>.*?</script>|<style\b[^>]*>.*?</style>|<[^>]+>)", re.S)
BEREICH = re.compile(r"(<!--(SPRACHWAHL|HREFLANG|I18N)-->)(.*?)(<!--/\2-->)", re.S)
ATTR = re.compile(r'([\w:-]+)(\s*=\s*)("([^"]*)"|\'([^\']*)\')')
PREIS_TOKEN = re.compile(r"\{\{preis:[^}]*\}\}")
# Deutsch-Reste in Übersetzungen: Umlaute oder typische deutsche Wörter
DEUTSCH = re.compile(r"[äöüßÄÖÜ]|\b(und|der|die|das|mit|für|Sie|Ihr|Ihre|Ihren|nicht|wir|ist|ein|eine|auf|zu|von|oder|bei|uns)\b")
# Eigennamen, die Umlaute enthalten dürfen
EIGENNAMEN = re.compile(r"Zürich|Grossmünster|EDÖB|Limmatquai")


def braucht_uebersetzung(text):
    """Nur Texte mit echten Wörtern – reine Preise/Zahlen/Zeichen bleiben stehen."""
    rest = PREIS_TOKEN.sub("", htmlmod.unescape(text)).replace("CHF", "")
    return re.search(r"[A-Za-zÀ-ÖØ-öø-ÿ]", rest) is not None


def norm(text):
    return re.sub(r"\s+", " ", text).strip()


def lies(pfad):
    with open(pfad, encoding="utf-8") as f:
        return f.read()


def schreib(pfad, inhalt):
    os.makedirs(os.path.dirname(pfad), exist_ok=True)
    with open(pfad, "w", encoding="utf-8") as f:
        f.write(inhalt)


# ————————————————————————— Bereiche (Umschalter, hreflang, Skripte) —————————————————————————

def bereich_inhalt(name, seite, sprache, einzug):
    vor = "" if sprache == "de" else "../"
    if name == "SPRACHWAHL":
        u = UMSCHALTER[sprache]
        links = []
        for s in ALLE:
            ziel = (seite if s == "de" else s + "/" + seite) if sprache == "de" else \
                   ("../" + seite if s == "de" else ("" if s == sprache else "../" + s + "/") + seite)
            aktiv = ' class="on" aria-current="true"' if s == sprache else ""
            links.append('<a href="%s" hreflang="%s" lang="%s"%s>%s</a>' % (ziel, s, s, aktiv, SPRACHNAMEN[s]))
        # <details> klappt auch ohne JavaScript auf; js/sprache.js schliesst es bei Klick daneben
        return ("\n%s<details class=\"lang-switch\" id=\"langSwitch\"><summary aria-label=\"%s\">%s</summary>"
                "<div class=\"lang-menu\">%s</div></details>"
                "\n%s<select class=\"cur-switch\" id=\"curSwitch\" aria-label=\"%s\" hidden>"
                "<option value=\"CHF\">CHF</option><option value=\"EUR\">EUR €</option>"
                "<option value=\"GBP\">GBP £</option><option value=\"USD\">USD $</option></select>\n%s") % (
                    einzug, u["sprache"], sprache.upper(), "".join(links), einzug, u["waehrung"], einzug)
    if name == "HREFLANG":
        zeilen = []
        for s in ALLE:
            url = BASIS_URL + ("" if s == "de" else s + "/") + ("" if seite == "index.html" else seite)
            zeilen.append('<link rel="alternate" hreflang="%s" href="%s">' % (s, url))
        zeilen.append('<link rel="alternate" hreflang="x-default" href="%s%s">' %
                      (BASIS_URL, "" if seite == "index.html" else seite))
        return "\n" + "\n".join(zeilen) + "\n"
    if name == "I18N":
        teile = []
        if sprache != "de":
            teile.append('<script src="../js/i18n/%s.js?v=%s"></script>' % (sprache, VERSION))
        teile.append('<script src="%sjs/sprache.js?v=%s"></script>' % (vor, VERSION))
        teile.append('<script src="%sjs/waehrung.js?v=%s"></script>' % (vor, VERSION))
        return "\n" + "\n".join(teile) + "\n"
    raise ValueError(name)


def fuelle_bereiche(quelltext, seite, sprache):
    def ersetze(m):
        zeilenanfang = quelltext.rfind("\n", 0, m.start()) + 1
        einzug = re.match(r"\s*", quelltext[zeilenanfang:m.start()]).group(0)
        return m.group(1) + bereich_inhalt(m.group(2), seite, sprache, einzug) + m.group(4)
    neu, n = BEREICH.subn(ersetze, quelltext)
    if n != 3:
        raise SystemExit("FEHLER: %s hat %d statt 3 Bereiche (SPRACHWAHL, HREFLANG, I18N)" % (seite, n))
    return neu


# ————————————————————————— Übersetzen —————————————————————————

class Uebersetzer:
    def __init__(self, woerter, sprache, gleich):
        self.w = woerter
        self.sprache = sprache
        self.gleich = gleich
        self.fehlend = []
        self.benutzt = set()

    def t(self, roh, wo):
        schluessel = norm(roh)
        if not schluessel or not braucht_uebersetzung(schluessel):
            return roh
        self.benutzt.add(schluessel)
        if schluessel in self.gleich and schluessel not in self.w:
            return roh
        if schluessel not in self.w:
            self.fehlend.append((schluessel, wo))
            return roh
        vorne = roh[:len(roh) - len(roh.lstrip())]
        hinten = roh[len(roh.rstrip()):]
        return vorne + self.w[schluessel] + hinten


def pfade_anpassen(tag):
    """In Unterordnern zeigen css/, js/, assets/ eine Ebene höher."""
    return re.sub(r'((?:href|src|poster|srcset)\s*=\s*")((?:css|js|assets)/)', r"\1../\2", tag)


def uebersetze_tag(tag, ue, seite):
    if tag.startswith("<!") or tag.startswith("</"):
        return tag
    ist_meta = tag.lower().startswith("<meta")
    meta_name = None
    if ist_meta:
        m = re.search(r'(?:name|property)\s*=\s*"([^"]+)"', tag)
        meta_name = m.group(1) if m else None

    def ersetze(m):
        name = m.group(1).lower()
        wert = m.group(4) if m.group(4) is not None else m.group(5)
        if name in TEXT_ATTRIBUTE or (ist_meta and name == "content" and meta_name in META_NAMEN):
            neu = ue.t(wert, "%s [%s]" % (seite, name))
            return '%s%s"%s"' % (m.group(1), m.group(2), neu.replace('"', "&quot;"))
        return m.group(0)
    return ATTR.sub(ersetze, tag)


def uebersetze_seite(quelltext, seite, ue):
    teile = TOKEN.split(quelltext)
    aus = []
    for teil in teile:
        if not teil:
            continue
        if teil.startswith("<script"):
            # Inline-Skripte: Texte laufen über T(); nur Modul-Pfade anpassen
            teil = pfade_anpassen(teil)
            teil = teil.replace("import('./js/", "import('../js/").replace('import("./js/', 'import("../js/')
            aus.append(teil)
        elif teil.startswith("<style") or teil.startswith("<!--"):
            aus.append(teil)
        elif teil.startswith("<"):
            t = uebersetze_tag(teil, ue, seite)
            if t.lower().startswith("<html"):
                t = re.sub(r'lang="de"', 'lang="%s"' % ue.sprache, t)
            aus.append(pfade_anpassen(t))
        else:
            aus.append(ue.t(teil, seite))
    return "".join(aus)


def ohne_bereiche(text):
    return BEREICH.sub(lambda m: m.group(1) + m.group(4), text)


# ————————————————————————— JavaScript-Texte —————————————————————————

def js_schluessel():
    aus = subprocess.run(["node", os.path.join(WURZEL, "tools", "js-texte.mjs")],
                         capture_output=True, text=True, cwd=WURZEL)
    if aus.returncode != 0:
        raise SystemExit("FEHLER beim Einlesen der JavaScript-Texte:\n" + aus.stderr)
    return sorted(set(json.loads(aus.stdout)))


# ————————————————————————— Ablauf —————————————————————————

def main():
    nur_fehlende = "--fehlende" in sys.argv
    gleich = set(json.loads(lies(os.path.join(WURZEL, "i18n", "gleich.json"))))
    quellen = {s: lies(os.path.join(WURZEL, s)) for s in SEITEN}
    js_noetig = js_schluessel()

    texte_pfad = os.path.join(WURZEL, "i18n", "texte.json")
    texte = json.loads(lies(texte_pfad)) if os.path.exists(texte_pfad) else {}

    ergebnisse = {}
    probleme = []
    for sprache in SPRACHEN:
        w = {k: v[sprache] for k, v in texte.items() if sprache in v}
        ue = Uebersetzer(w, sprache, gleich)
        seiten = {}
        for seite, text in quellen.items():
            text = ohne_bereiche(text)
            seiten[seite] = fuelle_bereiche(uebersetze_seite(text, seite, ue), seite, sprache)
        js = {}
        for k in js_noetig:
            if k in w:
                js[k] = w[k]
            elif k in gleich:
                js[k] = k
            else:
                probleme.append(("fehlt", sprache, "js", k, ""))

        # Prüfungen
        for k, wo in ue.fehlend:
            probleme.append(("fehlt", sprache, "html", k, wo))
        for k in sorted(set(w) - ue.benutzt - set(js_noetig)):
            probleme.append(("unbenutzt", sprache, "-", k, ""))
        for k, v in w.items():
            if not str(v).strip():
                probleme.append(("leer", sprache, "-", k, ""))
            elif DEUTSCH.search(EIGENNAMEN.sub("", htmlmod.unescape(PREIS_TOKEN.sub("", v)))):
                probleme.append(("deutsch-rest", sprache, "-", k, v[:60]))
            if PREIS_TOKEN.findall(k) != PREIS_TOKEN.findall(v):
                probleme.append(("preis-platzhalter", sprache, "-", k, ""))
            # Gleicher Text einmal mit &amp; (HTML), einmal mit & (JS) muss gleich übersetzt sein,
            # sonst findet das Kontaktformular die vorgewählte Leistung nicht
            roh = htmlmod.unescape(k)
            if roh != k and roh in w and htmlmod.unescape(v) != w[roh]:
                probleme.append(("ungleich html/js", sprache, "-", k, w[roh]))
        for k in texte:
            if sprache not in texte[k]:
                probleme.append(("fehlt", sprache, "-", k, "(Eintrag ohne diese Sprache)"))
        ergebnisse[sprache] = (seiten, js)
    for k in sorted(set(texte) & gleich):
        probleme.append(("doppelt", "-", "-", k, "steht in texte.json und gleich.json"))

    if nur_fehlende:
        fehl = {}
        for art, sprache, bereich, k, wo in probleme:
            if art == "fehlt":
                fehl.setdefault(sprache, {}).setdefault(bereich, {})[k] = wo
        print(json.dumps(fehl, ensure_ascii=False, indent=1))
        return

    if probleme:
        for art, sprache, bereich, k, wo in probleme[:80]:
            print("%-17s %s/%s  %s  %s" % (art, sprache, bereich, k[:90], wo))
        raise SystemExit("ABBRUCH: %d Probleme – es wurde nichts geschrieben." % len(probleme))

    # Schreiben: deutsche Seiten (nur Bereiche), Sprachordner, JS-Wörterbücher
    for seite, text in quellen.items():
        neu = fuelle_bereiche(text, seite, "de")
        if neu != text:
            schreib(os.path.join(WURZEL, seite), neu)
    for sprache, (seiten, js) in ergebnisse.items():
        for seite, text in seiten.items():
            schreib(os.path.join(WURZEL, sprache, seite), text)
        schreib(os.path.join(WURZEL, "js", "i18n", sprache + ".js"),
                "/* Erzeugt von tools/sprachen-bauen.py – nicht von Hand ändern */\n"
                "window.HD_I18N = " + json.dumps(js, ensure_ascii=False, indent=0, sort_keys=True) + ";\n")
    print("OK: %d Seiten × %d Sprachen geschrieben, %d JS-Texte." %
          (len(SEITEN), len(SPRACHEN), len(js_noetig)))


if __name__ == "__main__":
    main()
