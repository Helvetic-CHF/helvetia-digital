/* Helvetia Digital — gemeinsames Verhalten aller Seiten */
(function(){
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  /* Geräteerkennung aus js/geraet.js (Fallback, falls das Skript fehlt) */
  var G = window.Geraet || { typ:"desktop", eingabe:"maus", netz:"schnell", leistung:"normal",
    istHandy:false, istTablet:false, istDesktop:true, istTouch:false, bei:function(fn){ fn(this); } };

  /* ————— Navbar: Scroll-Zustand ————— */
  var nav = document.getElementById("nav");
  if(nav){
    var onNavScroll = function(){ nav.classList.toggle("scrolled", window.scrollY > 24); };
    window.addEventListener("scroll", onNavScroll, {passive:true});
    onNavScroll();
  }

  /* ————— Mobile-Menü ————— */
  var burger = document.getElementById("navBurger");
  var links = document.getElementById("navLinks");
  if(burger && links){
    burger.addEventListener("click", function(){
      var open = links.classList.toggle("open");
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-label", open ? "Menü schliessen" : "Menü öffnen");
    });
  }

  /* ————— Reveal beim Scrollen ————— */
  var revealObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting || e.boundingClientRect.top < 0){
        e.target.classList.add("in");
        revealObserver.unobserve(e.target);
      }
    });
  }, {threshold:.12});
  document.querySelectorAll(".reveal:not(.in)").forEach(function(el){ revealObserver.observe(el); });
  /* Sicherheitsnetz: Elemente oberhalb des Viewports sofort einblenden */
  var sweepTick = false;
  function sweepAbove(){
    sweepTick = false;
    document.querySelectorAll(".reveal:not(.in)").forEach(function(el){
      if(el.getBoundingClientRect().bottom < 80){ el.classList.add("in"); revealObserver.unobserve(el); }
    });
  }
  window.addEventListener("scroll", function(){
    if(!sweepTick){ sweepTick = true; requestAnimationFrame(sweepAbove); }
  }, {passive:true});
  sweepAbove();

  /* ————— Kennzahlen hochzählen ————— */
  function countUp(el){
    var target = parseInt(el.dataset.count, 10);
    var suffix = el.dataset.suffix || "";
    if(reduceMotion){ el.textContent = target + suffix; return; }
    var start = null, dur = 1500;
    function step(ts){
      if(!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if(p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var statEls = document.querySelectorAll("[data-count]");
  if(statEls.length){
    var statObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ countUp(e.target); statObserver.unobserve(e.target); }
      });
    }, {threshold:.6});
    /* Im HTML steht der Endwert (für Besucher ohne JavaScript); hier auf 0 stellen und hochzählen */
    statEls.forEach(function(el){ if(!reduceMotion) el.textContent = "0" + (el.dataset.suffix || ""); statObserver.observe(el); });
  }

  /* ————— Hero-Video: Pause & sanfter Scroll-Rahmen (nur Startseite) ————— */
  var heroVideo = document.getElementById("heroVideo");
  var heroMedia = document.getElementById("heroMedia");
  var heroPause = document.getElementById("heroPause");
  /* Handy mit langsamer Verbindung oder Datensparmodus: Video gar nicht erst laden,
     das Standbild (poster) bleibt – Datenvolumen schonen */
  if(heroVideo && G.istHandy && G.netz === "langsam"){
    heroVideo.removeAttribute("autoplay");
    Array.prototype.forEach.call(heroVideo.querySelectorAll("source"), function(src){ src.removeAttribute("src"); });
    heroVideo.load();
    if(heroPause) heroPause.classList.add("ohne-video");
    heroVideo = null;
  }
  /* Autoplay kann auf Handys verboten sein (Energiesparmodus): dann Standbild zeigen
     und den Knopf auf „abspielen" stellen. Nur ein echtes Verbot zählt (NotAllowedError);
     ein AbortError beim Laden ist harmlos und wird ignoriert. */
  if(heroVideo){
    var autoplayGeprueft = false;
    var pruefeAutoplay = function(){
      if(autoplayGeprueft) return;
      autoplayGeprueft = true;
      setTimeout(function(){
        if(!heroVideo.paused || heroVideo.ended) return; // läuft bereits – nichts zu tun
        var versuch = heroVideo.play();
        if(versuch && versuch.catch){
          versuch.catch(function(err){
            if(!err || err.name !== "NotAllowedError") return;
            if(heroPause){ heroPause.classList.add("toggled"); heroPause.setAttribute("aria-label","Video abspielen"); }
          });
        }
      }, 800);
    };
    if(heroVideo.readyState >= 2) pruefeAutoplay();
    else heroVideo.addEventListener("loadeddata", pruefeAutoplay, {once:true});
  }
  if(heroVideo && heroPause){
    heroPause.addEventListener("click", function(){
      if(heroVideo.paused){
        heroVideo.play();
        heroPause.classList.remove("toggled");
        heroPause.setAttribute("aria-label","Video pausieren");
      } else {
        heroVideo.pause();
        heroPause.classList.add("toggled");
        heroPause.setAttribute("aria-label","Video abspielen");
      }
    });
  }
  if(heroMedia && !reduceMotion){
    var heroEl = document.querySelector(".hero");
    var heroInner = heroMedia.querySelector("video, img");
    var ticking = false;
    var heroFrame = function(){
      ticking = false;
      var h = heroEl.offsetHeight;
      var p = Math.min(Math.max(window.scrollY / (h * 0.9), 0), 1);
      var inset = p * 20;
      var radius = p * 28;
      heroMedia.style.clipPath = "inset(" + (inset*0.6) + "px " + inset + "px " + (inset*0.8) + "px " + inset + "px round " + radius + "px)";
      if(heroInner) heroInner.style.transform = "scale(" + (1.02 + p * 0.05) + ")";
    };
    window.addEventListener("scroll", function(){
      if(!ticking){ ticking = true; requestAnimationFrame(heroFrame); }
    }, {passive:true});
  }

  /* ————— Smartphone-Mockup: dezenter Tilt ————— */
  var phone = document.getElementById("phone");
  var canHover = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
  if(phone && canHover && !reduceMotion){
    /* Maus: Tilt folgt dem Zeiger */
    phone.addEventListener("mousemove", function(ev){
      var r = phone.getBoundingClientRect();
      var x = (ev.clientX - r.left) / r.width - .5;
      var y = (ev.clientY - r.top) / r.height - .5;
      phone.style.transform = "rotateY(" + (x * 10) + "deg) rotateX(" + (-y * 8) + "deg)";
    });
    phone.addEventListener("mouseleave", function(){ phone.style.transform = "rotateY(0) rotateX(0)"; });
  } else if(phone && !reduceMotion && G.leistung !== "schwach"){
    /* Touch: Tilt folgt der Neigung des Geräts (Gyroskop), wo das ohne Nachfrage
       erlaubt ist (Android). Auf iOS wäre eine Berechtigungsabfrage nötig – dort und
       ohne Sensor wiegt sich das Gerät sanft von selbst, damit der Effekt überall sichtbar ist. */
    var gyroAktiv = false, gyroTimer = null;
    var wiegen = function(){ phone.classList.add("wiegt"); };
    var aufNeigung = function(ev){
      if(ev.gamma === null || ev.gamma === undefined) return;
      if(!gyroAktiv){ gyroAktiv = true; clearTimeout(gyroTimer); phone.classList.remove("wiegt"); }
      /* gamma: links/rechts (−90…90), beta: vor/zurück (−180…180) – gedämpft und begrenzt */
      var quer = Math.max(-25, Math.min(25, ev.gamma));
      var laengs = Math.max(-25, Math.min(25, ev.beta - 45)); // 45° ≈ Halte-Neigung
      phone.style.transform = "rotateY(" + (quer * 0.4) + "deg) rotateX(" + (-laengs * 0.3) + "deg)";
    };
    var brauchtErlaubnis = typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function";
    if(!brauchtErlaubnis && "DeviceOrientationEvent" in window){
      window.addEventListener("deviceorientation", aufNeigung, {passive:true});
      gyroTimer = setTimeout(function(){ if(!gyroAktiv) wiegen(); }, 1500);
    } else {
      wiegen();
    }
  }

  /* ————— Preis-Umschalter (Seite «Preise») ————— */
  var pill = document.getElementById("togglePill");
  if(pill){
    var slider = document.getElementById("toggleSlider");
    var toggleButtons = pill.querySelectorAll("button");
    var positionSlider = function(btn){
      slider.style.width = btn.offsetWidth + "px";
      slider.style.transform = "translateX(" + (btn.offsetLeft - 5) + "px)";
    };
    var setMode = function(mode){
      toggleButtons.forEach(function(b){ b.classList.toggle("active", b.dataset.mode === mode); });
      positionSlider(pill.querySelector("button.active"));
      document.querySelectorAll("[data-plan]").forEach(function(el){
        var chf = el.dataset[mode + "Chf"];
        var sub = el.dataset[mode + "Sub"];
        var per = el.dataset[mode + "Per"] || "";
        var best = el.dataset[mode + "Best"];
        el.style.opacity = "0";
        setTimeout(function(){
          el.innerHTML = '<span class="chf">' + chf + '</span>' +
            (per ? '<span class="per">' + per + '</span>' : '') +
            (best ? '<span class="best">Bestpreis</span>' : '') +
            '<span class="sub">' + sub + '</span>';
          el.style.transition = "opacity .3s";
          el.style.opacity = "1";
        }, reduceMotion ? 0 : 160);
      });
    };
    toggleButtons.forEach(function(b){
      b.addEventListener("click", function(){ setMode(b.dataset.mode); });
    });
    window.addEventListener("resize", function(){ positionSlider(pill.querySelector("button.active")); });
    window.addEventListener("load", function(){ positionSlider(pill.querySelector("button.active")); });
    positionSlider(toggleButtons[0]);
  }

  /* ————— Leistungs-Karussell ————— */
  var carousel = document.getElementById("carousel");
  if(carousel){
    var carSlides = Array.prototype.slice.call(carousel.querySelectorAll(".car-slide"));
    var dotsWrap = document.getElementById("carDots");
    var nSlides = carSlides.length, cur = 0;
    var dragMoved = false;

    carSlides.forEach(function(s, i){
      var d = document.createElement("button");
      d.className = "car-dot";
      d.setAttribute("aria-label", "Beispiel " + (i + 1) + " anzeigen");
      d.addEventListener("click", function(){ goTo(i); });
      dotsWrap.appendChild(d);
    });
    var dots = dotsWrap.children;

    function goTo(i){
      cur = ((i % nSlides) + nSlides) % nSlides;
      carSlides.forEach(function(s, k){
        var off = (k - cur + nSlides) % nSlides;
        var cls = "car-slide";
        if(off === 0) cls += " pos-0";
        else if(off === 1) cls += " pos-1";
        else if(off === nSlides - 1) cls += " pos-m1";
        else if(off === 2) cls += " pos-2";
        else if(off === nSlides - 2) cls += " pos-m2";
        else cls += " pos-h";
        s.className = cls;
        s.setAttribute("aria-hidden", off === 0 ? "false" : "true");
      });
      for(var k = 0; k < nSlides; k++) dots[k].classList.toggle("on", k === cur);
    }

    document.getElementById("carPrev").addEventListener("click", function(){ goTo(cur - 1); });
    document.getElementById("carNext").addEventListener("click", function(){ goTo(cur + 1); });

    carousel.addEventListener("keydown", function(ev){
      if(ev.key === "ArrowLeft"){ ev.preventDefault(); goTo(cur - 1); }
      if(ev.key === "ArrowRight"){ ev.preventDefault(); goTo(cur + 1); }
    });

    /* Klick auf Nachbar-Slide navigiert dorthin */
    carSlides.forEach(function(s, k){
      s.addEventListener("click", function(){
        if(dragMoved) return;
        if((k - cur + nSlides) % nSlides !== 0) goTo(k);
      });
    });

    /* Ziehen / Wischen */
    var downX = null;
    var stage = document.getElementById("carStage");
    stage.addEventListener("pointerdown", function(ev){ downX = ev.clientX; dragMoved = false; });
    window.addEventListener("pointermove", function(ev){
      if(downX !== null && Math.abs(ev.clientX - downX) > 10) dragMoved = true;
    });
    window.addEventListener("pointerup", function(ev){
      if(downX === null) return;
      var dx = ev.clientX - downX;
      if(dx < -45) goTo(cur + 1);
      else if(dx > 45) goTo(cur - 1);
      downX = null;
      setTimeout(function(){ dragMoved = false; }, 0);
    });

    goTo(0);
  }

  /* ————— Kontaktformular: Leistung vorwählen + mailto ————— */
  var form = document.getElementById("contactForm");
  if(form){
    var sel = document.getElementById("leistung");
    var wanted = new URLSearchParams(window.location.search).get("leistung");
    if(sel && wanted){
      Array.prototype.forEach.call(sel.options, function(o){
        if(o.text.replace(/\s+/g," ").trim() === wanted.replace(/\s+/g," ").trim()) sel.value = o.value || o.text;
      });
    }
    var produkt = new URLSearchParams(window.location.search).get("produkt");
    var nachricht = document.getElementById("nachricht");
    if(produkt && nachricht && !nachricht.value){
      nachricht.value = "Ich interessiere mich für: " + produkt + "\n\n";
    }
    form.addEventListener("submit", function(ev){
      ev.preventDefault();
      var v = function(id){ return document.getElementById(id).value.trim(); };
      var subject = "Anfrage: " + v("leistung") + " – " + v("vorname") + " " + v("nachname");
      var body = "Vorname: " + v("vorname") + "\n" +
                 "Nachname: " + v("nachname") + "\n" +
                 "E-Mail: " + v("email") + "\n" +
                 "Leistung: " + v("leistung") + "\n\n" +
                 "Nachricht:\n" + v("nachricht");
      window.location.href = "mailto:helvetiaadigi@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    });
  }

  /* ————— Website-Check: Formular prüfen + mailto ————— */
  var checkForm = document.getElementById("checkForm");
  if(checkForm){
    var checkErr = document.getElementById("checkError");
    checkForm.addEventListener("submit", function(ev){
      ev.preventDefault();
      var site = document.getElementById("website");
      var mail = document.getElementById("email");
      var name = document.getElementById("name");
      var siteOk = site.value.trim().length > 3 && site.value.indexOf(".") > 0;
      var mailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail.value.trim());
      site.classList.toggle("invalid", !siteOk);
      mail.classList.toggle("invalid", !mailOk);
      if(!siteOk || !mailOk){
        checkErr.hidden = false;
        (siteOk ? mail : site).focus();
        return;
      }
      checkErr.hidden = true;
      var subject = "Website-Check: " + site.value.trim();
      var body = "Website: " + site.value.trim() + "\n" +
                 "E-Mail: " + mail.value.trim() + "\n" +
                 "Name: " + (name.value.trim() || "–") + "\n\n" +
                 "Bitte prüfen Sie meine Website in den 5 Punkten (Mobil-Darstellung, Ladezeit, Google-Auffindbarkeit, Kontakt und Buchung, Rechtliches).";
      window.location.href = "mailto:helvetiaadigi@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    });
  }
})();
