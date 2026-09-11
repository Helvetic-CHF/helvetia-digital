/* ============================================================
   360°-Objekte — reines CSS-3D, keine Bibliothek, offline-tauglich.
   Dreht von allein, mit Maus oder Finger selbst drehbar.
   ============================================================ */
(function(){
  "use strict";

  var KERN_ICON = {
    chat:    'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
    telefon: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z',
    knoten:  'M6 15V9a3 3 0 0 1 3-3h6M18 9v3a3 3 0 0 1-3 3H9',
    buch:    'M4 19.5V5a2 2 0 0 1 2-2h13v18H6a2 2 0 0 1-2-2.5zM9 8h7M9 12h5',
    karte:   'M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z'
  };

  /* ---------- Objekt-Aufbau ---------- */

  function svgIcon(pfad){
    return '<svg viewBox="0 0 24 24"><path d="' + pfad + '"/></svg>';
  }

  function baueBrowser(){
    var el = document.createElement("div");
    el.className = "kp-objekt kp-o-browser";
    el.innerHTML =
      '<div class="kp-scheibe" style="transform:translateZ(14px)">' +
        '<div class="kp-leiste"></div>' +
        '<div class="kp-block" style="top:24px;left:10px;width:64px;height:34px"></div>' +
        '<div class="kp-block" style="top:24px;left:82px;right:10px;height:9px"></div>' +
        '<div class="kp-block" style="top:39px;left:82px;right:10px;height:6px;opacity:.6"></div>' +
        '<div class="kp-block" style="top:50px;left:82px;width:56px;height:6px;opacity:.4"></div>' +
        '<div class="kp-block" style="top:68px;left:10px;right:10px;height:22px;opacity:.5"></div>' +
        '<div class="kp-block" style="top:98px;left:10px;width:52px;height:12px"></div>' +
      '</div>' +
      '<div class="kp-scheibe" style="transform:translateZ(-14px) rotateY(180deg);opacity:.5"></div>';
    return el;
  }

  function baueHandy(){
    var el = document.createElement("div");
    el.className = "kp-objekt kp-o-handy";
    el.innerHTML =
      '<div class="kp-scheibe" style="transform:translateZ(9px)">' +
        '<div class="kp-kerbe"></div>' +
        '<div class="kp-block" style="position:absolute;top:22px;left:9px;right:9px;height:38px;border-radius:6px;background:rgba(255,255,255,.1)"></div>' +
        '<div class="kp-block" style="position:absolute;top:68px;left:9px;right:9px;height:7px;border-radius:3px;background:rgba(255,255,255,.12)"></div>' +
        '<div class="kp-block" style="position:absolute;top:81px;left:9px;width:38px;height:7px;border-radius:3px;background:rgba(255,255,255,.08)"></div>' +
        '<div class="kp-block" style="position:absolute;bottom:22px;left:9px;right:9px;height:16px;border-radius:8px;background:rgba(47,127,212,.5)"></div>' +
      '</div>' +
      '<div class="kp-scheibe" style="transform:translateZ(-9px) rotateY(180deg);opacity:.45"></div>';
    return el;
  }

  function baueEbenen(){
    var el = document.createElement("div");
    el.className = "kp-objekt kp-o-ebenen";
    var teile = "";
    for (var i = 0; i < 4; i++){
      var z = (i - 1.5) * 20;
      teile += '<div class="kp-ebene" style="transform:translateZ(' + z + 'px);opacity:' + (0.45 + i * 0.16) + '"></div>';
    }
    el.innerHTML = teile;
    return el;
  }

  function baueKugel(art, ton){
    var el = document.createElement("div");
    el.className = "kp-objekt";
    el.style.width = "180px";
    el.style.height = "180px";
    var t = ton === "gold" ? ' data-ton="gold"' : "";
    var teile =
      '<div class="kp-ring"' + t + ' style="transform:rotateX(74deg)"></div>' +
      '<div class="kp-ring"' + t + ' style="transform:rotateX(74deg) rotateY(60deg)"></div>' +
      '<div class="kp-ring"' + t + ' style="transform:rotateX(74deg) rotateY(120deg)"></div>' +
      '<div class="kp-ring"' + t + ' style="transform:rotateY(90deg)"></div>' +
      '<div class="kp-kern"' + t + '>' + svgIcon(KERN_ICON[art] || KERN_ICON.karte) + '</div>';
    for (var i = 0; i < 6; i++){
      var w = i * 60;
      teile += '<div class="kp-punkt"' + t + ' style="transform:rotateY(' + w + 'deg) translateZ(88px)"></div>';
    }
    el.innerHTML = teile;
    return el;
  }

  function baueObjekt(art){
    if (art === "browser") return baueBrowser();
    if (art === "handy")   return baueHandy();
    if (art === "ebenen")  return baueEbenen();
    var gold = (art === "buch" || art === "ebenen");
    return baueKugel(art, gold ? "gold" : "blau");
  }

  /* ---------- Drehung ---------- */

  function starteDrehung(buehne, objekt){
    var drehY = 0, drehX = -14;
    var auto  = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var greift = false, letztesX = 0, letztesY = 0, zeiger = null;
    var laeuft = true;

    function male(){
      objekt.style.transform = "rotateX(" + drehX + "deg) rotateY(" + drehY + "deg)";
    }

    function schritt(){
      if (!laeuft) return;
      if (auto && !greift){ drehY += 0.28; male(); }
      requestAnimationFrame(schritt);
    }

    buehne.addEventListener("pointerdown", function(ev){
      greift = true; zeiger = ev.pointerId;
      letztesX = ev.clientX; letztesY = ev.clientY;
      buehne.classList.add("greift");
      buehne.setPointerCapture(ev.pointerId);
    });

    buehne.addEventListener("pointermove", function(ev){
      if (!greift || ev.pointerId !== zeiger) return;
      drehY += (ev.clientX - letztesX) * 0.55;
      drehX -= (ev.clientY - letztesY) * 0.35;
      if (drehX >  75) drehX =  75;
      if (drehX < -75) drehX = -75;
      letztesX = ev.clientX; letztesY = ev.clientY;
      male();
    });

    function loslassen(ev){
      if (ev.pointerId !== zeiger) return;
      greift = false; zeiger = null;
    }
    buehne.addEventListener("pointerup", loslassen);
    buehne.addEventListener("pointercancel", loslassen);

    male();
    requestAnimationFrame(schritt);

    return {
      setAuto: function(an){ auto = an; },
      stop: function(){ laeuft = false; }
    };
  }

  /* ---------- Öffentliche Funktion ---------- */

  window.KompassObjekt = function(behaelter, art){
    var buehne = document.createElement("div");
    buehne.className = "kp-buehne";
    buehne.setAttribute("role", "img");
    buehne.setAttribute("aria-label", "Dreidimensionale Darstellung des Produkts, mit Maus oder Finger drehbar");

    var objekt;
    try {
      objekt = baueObjekt(art);
    } catch (e) {
      buehne.textContent = "";
      behaelter.appendChild(buehne);
      return null;
    }
    buehne.appendChild(objekt);
    behaelter.appendChild(buehne);

    var steuerung = starteDrehung(buehne, objekt);

    /* Auto / selbst drehen */
    var schalter = document.createElement("div");
    schalter.className = "kp-dreh-schalter";
    schalter.innerHTML =
      '<button type="button" class="aktiv" data-auto="1">Dreht automatisch</button>' +
      '<button type="button" data-auto="0">Selbst drehen</button>';
    schalter.addEventListener("click", function(ev){
      var knopf = ev.target.closest("button");
      if (!knopf) return;
      schalter.querySelectorAll("button").forEach(function(b){ b.classList.remove("aktiv"); });
      knopf.classList.add("aktiv");
      steuerung.setAuto(knopf.dataset.auto === "1");
    });
    behaelter.appendChild(schalter);

    return steuerung;
  };
})();
