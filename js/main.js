/* Helvetia Digital — gemeinsames Verhalten aller Seiten */
(function(){
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
    statEls.forEach(function(el){ statObserver.observe(el); });
  }

  /* ————— Hero-Video: Pause & sanfter Scroll-Rahmen (nur Startseite) ————— */
  var heroVideo = document.getElementById("heroVideo");
  var heroMedia = document.getElementById("heroMedia");
  var heroPause = document.getElementById("heroPause");
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
    phone.addEventListener("mousemove", function(ev){
      var r = phone.getBoundingClientRect();
      var x = (ev.clientX - r.left) / r.width - .5;
      var y = (ev.clientY - r.top) / r.height - .5;
      phone.style.transform = "rotateY(" + (x * 10) + "deg) rotateX(" + (-y * 8) + "deg)";
    });
    phone.addEventListener("mouseleave", function(){ phone.style.transform = "rotateY(0) rotateX(0)"; });
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
})();
