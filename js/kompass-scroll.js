// Scroll-Explosion des Kompasses — aus dem Claude-Design-Export "Brass compass 3D model".
// Beim Scrollen durch den Abschnitt zerlegt sich der Kompass in seine Teile,
// beim Zurückscrollen setzt er sich wieder zusammen.
// Anpassungen gegenüber dem Export: Fortschritt bezieht sich auf den Abschnitt
// (nicht auf die ganze Seite), transparenter Hintergrund für das dunkle Design,
// Kamera rückt auf schmalen Bildschirmen weiter weg.
// Geräte-Anpassung (window.Geraet aus js/geraet.js): Fortschritt misst sich an der
// Bühnenhöhe statt an innerHeight (das springt auf Handys mit der Adressleiste),
// schwache Geräte rendern mit weniger Pixeln, und ausserhalb des Sichtfelds ruht
// die Render-Schleife (Akku).
import * as THREE from 'three';
import { buildCompass } from './kompass-modell.js';

const EASE = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = v => Math.min(1, Math.max(0, v));
const V = (x, y, z) => new THREE.Vector3(x, y, z).normalize();

// Teile auf der Mittelachse: feste Richtung, Weite und Startzeitpunkt (0–1)
const AXIAL = {
  case_body:        { dir: V(0, -1, 0), dist: 1.15, t0: 0.00 },
  bezel_ring:       { dir: V(0, 1, 0),  dist: 1.35, t0: 0.00 },
  crystal_glass:    { dir: V(0, 1, 0),  dist: 1.75, t0: 0.00 },
  dial_face:        { dir: V(0, -1, 0), dist: 0.55, t0: 0.20 },
  dial_ring_band:   { dir: V(0, -1, 0), dist: 0.75, t0: 0.18 },
  graduation_band:  { dir: V(0, 1, 0),  dist: 0.60, t0: 0.16 },
  ink_circle_outer: { dir: V(0, 1, 0),  dist: 0.85, t0: 0.12 },
  ink_circle_inner: { dir: V(0, 1, 0),  dist: 1.00, t0: 0.10 },
  hub_ring:         { dir: V(0, 1, 0),  dist: 0.90, t0: 0.22 },
  pivot_cap:        { dir: V(0, 1, 0),  dist: 1.15, t0: 0.14 },
  pivot_jewel:      { dir: V(0, 1, 0),  dist: 1.45, t0: 0.06 },
};

// Gruppierte Teile fliegen radial nach aussen
const RADIAL = {
  graduation_ticks: { dist: 1.30, t0: 0.04 },
  hub_rosette:      { dist: 0.80, t0: 0.24 },
  compass_rose:     { dist: 1.05, t0: 0.14 },
  mount_lug:        { dist: 1.20, t0: 0.02 },
  lug_screw:        { dist: 1.40, t0: 0.00 },
  needle_north:     { dist: 1.50, t0: 0.00 },
  needle_sight:     { dist: 1.50, t0: 0.00 },
};

function collectMovers(root) {
  const movers = [];
  const SPREAD = 0.26; // Meter bei voller Explosion

  const add = (mesh, parentName) => {
    mesh.material = mesh.material.clone();
    mesh.material.transparent = true;
    mesh.castShadow = false;
    mesh.receiveShadow = false;

    const axial = AXIAL[mesh.name];
    let dir, dist, t0;
    if (axial) {
      dir = axial.dir.clone(); dist = axial.dist; t0 = axial.t0;
    } else {
      mesh.geometry.computeBoundingSphere();
      const c = mesh.geometry.boundingSphere.center.clone().applyEuler(mesh.rotation).add(mesh.position);
      const flat = new THREE.Vector3(c.x, 0, c.z);
      dir = flat.length() > 1e-4
        ? flat.normalize().setY(0.18).normalize()
        : V(0, 1, 0);
      const cfg = RADIAL[parentName] || RADIAL[mesh.name] || { dist: 1, t0: 0.1 };
      dist = cfg.dist; t0 = cfg.t0;
    }
    movers.push({
      mesh, dir, t0,
      base: mesh.position.clone(),
      travel: dir.clone().multiplyScalar(SPREAD * dist),
      baseOpacity: mesh.material.opacity,
    });
  };

  for (const child of root.children) {
    if (child.isGroup) child.children.forEach(m => add(m, child.name));
    else add(child, child.name);
  }
  return movers;
}

/**
 * @param {HTMLCanvasElement} canvas  Zeichenfläche
 * @param {HTMLElement} scroller      Der hohe Abschnitt, dessen Scrollweg den Fortschritt bestimmt
 */
export function mountScrollCompass(canvas, scroller) {
  const G = window.Geraet || {};
  const schwach = G.leistung === 'schwach';
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !schwach, alpha: true, powerPreference: schwach ? 'low-power' : 'default' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, schwach ? 1.25 : G.istHandy ? 1.75 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0); // Seitenhintergrund scheint durch

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(34, 1, 0.01, 10);
  const CAM_BASE = new THREE.Vector3(0.075, 0.185, 0.23);
  const LOOK_AT = new THREE.Vector3(0, 0.012, 0);

  scene.add(new THREE.HemisphereLight(0xfff6e6, 0xb9a97c, 1.1));
  const key = new THREE.DirectionalLight(0xfff4e2, 2.1);
  key.position.set(0.22, 0.34, 0.2);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xdfe6ef, 0.85);
  fill.position.set(-0.26, 0.12, -0.18);
  scene.add(fill);

  const compass = buildCompass();
  scene.add(compass);
  const movers = collectMovers(compass);

  // Fortschritt 0–1 über den Scrollweg des Abschnitts
  let target = 0, current = 0;
  const buehne = canvas.parentElement; // die klebende Bühne, so hoch wie der sichtbare Bereich
  const onScroll = () => {
    const rect = scroller.getBoundingClientRect();
    const max = scroller.offsetHeight - (buehne ? buehne.offsetHeight : innerHeight);
    target = max > 0 ? clamp01(-rect.top / max) : 0;
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  addEventListener('geraet:wechsel', onScroll);
  onScroll();

  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Hochformat: Kamera weiter weg, damit der Kompass ganz ins Bild passt
    const zoomOut = camera.aspect < 1 ? Math.min(1.9, 1 / camera.aspect) : 1;
    camera.position.copy(CAM_BASE).multiplyScalar(zoomOut);
    camera.lookAt(LOOK_AT);
    // Querformat: Kompass nach rechts, damit der Text links Platz hat;
    // Hochformat: nach unten, damit der Text oben frei bleibt
    compass.position.x = camera.aspect > 1.3 ? 0.06 : 0;
    compass.position.y = camera.aspect < 1 ? -0.09 : 0;
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(canvas);
  resize();

  // Nur rendern, wenn der Abschnitt im Sichtfeld ist
  let sichtbar = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { sichtbar = e.isIntersecting; }, { rootMargin: '80px 0px' }).observe(scroller);
  }
  renderer.setAnimationLoop(() => {
    if (!sichtbar && Math.abs(target - current) < 0.001) return;
    current += (target - current) * 0.09; // weich nachlaufend
    const p = clamp01(current);
    for (const m of movers) {
      const local = clamp01((p - m.t0) / (1 - m.t0));
      const e = EASE(local);
      m.mesh.position.copy(m.base).addScaledVector(m.travel, e);
      m.mesh.material.opacity = m.baseOpacity * (1 - clamp01((local - 0.72) / 0.28));
      m.mesh.visible = m.mesh.material.opacity > 0.01;
    }
    renderer.render(scene, camera);
  });

  return { progress: () => current, set: p => { target = clamp01(p); } };
}
