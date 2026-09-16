// Messing-Kompass als 3D-Modell (three.js) — 1:1 aus dem Claude-Design-Export "Brass compass 3D model".
// Alle Teile tragen Namen; kompass-scroll.js nutzt sie, um jedes Teil beim Scrollen einzeln zu bewegen.
import * as THREE from './vendor/three.module.js';

const M = {
  brass: new THREE.MeshStandardMaterial({ name: 'brass', color: 0xc79a55, metalness: 0.38, roughness: 0.3 }),
  brassDark: new THREE.MeshStandardMaterial({ name: 'brass_dark', color: 0x8d6636, metalness: 0.35, roughness: 0.5 }),
  paper: new THREE.MeshStandardMaterial({ name: 'dial_paper', color: 0xe9dcc0, metalness: 0, roughness: 0.92 }),
  paperRing: new THREE.MeshStandardMaterial({ name: 'dial_ring', color: 0xdccaa6, metalness: 0, roughness: 0.92 }),
  ink: new THREE.MeshStandardMaterial({ name: 'ink', color: 0x0f0d0c, metalness: 0.05, roughness: 0.5 }),
  paperWhite: new THREE.MeshStandardMaterial({ name: 'dial_white', color: 0xfaf5ea, metalness: 0, roughness: 0.85 }),
  glass: new THREE.MeshStandardMaterial({
    name: 'glass', color: 0xdde8e6, metalness: 0.1, roughness: 0.05,
    transparent: true, opacity: 0.2, side: THREE.DoubleSide,
  }),
};

const mesh = (geo, mat, name) => {
  const m = new THREE.Mesh(geo, mat);
  m.name = name;
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
};

// flat shape extruded in XZ plane, top face at y = `y`
function flat(shape, thickness, y, name, mat) {
  const geo = new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false, curveSegments: 24 });
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, y, 0);
  return mesh(geo, mat, name);
}

export function buildCompass() {
  const g = new THREE.Group();
  g.name = 'pocket_compass';

  const R_OUT = 0.0455, DIAL_R = 0.0368, FLOOR = 0.010, RIM_Y = 0.0205;

  // ---- brass case (surface of revolution) ----
  const profile = [
    [0.0000, 0.0000], [0.0360, 0.0000], [0.0428, 0.0022], [R_OUT, 0.0058],
    [R_OUT, 0.0150], [0.0448, 0.0186], [0.0418, 0.0205], [0.0396, 0.0205],
    [0.0390, 0.0182], [0.0390, FLOOR], [0.0000, FLOOR],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  g.add(mesh(new THREE.LatheGeometry(profile, 96), M.brass, 'case_body'));

  // bezel ring over the rim
  const bezel = mesh(new THREE.TorusGeometry(0.0408, 0.0026, 20, 96), M.brass, 'bezel_ring');
  bezel.rotation.x = Math.PI / 2;
  bezel.position.y = RIM_Y;
  g.add(bezel);

  // mounting lug at the bottom edge
  const lug = mesh(new THREE.BoxGeometry(0.017, 0.0035, 0.014), M.brass, 'mount_lug');
  lug.position.set(0, 0.0018, R_OUT - 0.002);
  g.add(lug);
  const screw = mesh(new THREE.CylinderGeometry(0.0022, 0.0022, 0.0024, 24), M.brassDark, 'lug_screw');
  screw.position.set(0, 0.0036, R_OUT + 0.0025);
  g.add(screw);

  // ---- dial ----
  g.add(mesh(new THREE.CylinderGeometry(DIAL_R, DIAL_R, 0.0022, 96), M.paper, 'dial_face')
    .translateY(FLOOR + 0.0011));
  const ring = mesh(new THREE.CylinderGeometry(DIAL_R, DIAL_R, 0.0006, 96, 1, true), M.paperRing, 'dial_ring_band');
  ring.position.y = FLOOR + 0.0019;
  g.add(ring);

  // graduated ring: paper band + ticks
  const band = mesh(new THREE.RingGeometry(0.0288, DIAL_R - 0.0004, 96), M.paperRing, 'graduation_band');
  band.rotation.x = -Math.PI / 2;
  band.position.y = FLOOR + 0.0023;
  g.add(band);

  const ticks = new THREE.Group();
  ticks.name = 'graduation_ticks';
  for (let i = 0; i < 120; i++) {
    const a = (i / 120) * Math.PI * 2;
    const major = i % 10 === 0;
    const len = major ? 0.0062 : i % 5 === 0 ? 0.0044 : 0.0026;
    const t = mesh(new THREE.BoxGeometry(major ? 0.0009 : 0.0005, 0.0004, len), M.ink, `tick_${String(i).padStart(3, '0')}`);
    const r = 0.0334 - len / 2;
    t.position.set(Math.cos(a) * r, FLOOR + 0.0026, Math.sin(a) * r);
    t.rotation.y = -a;
    ticks.add(t);
  }
  g.add(ticks);

  // two fine ink circles framing the rose
  for (const [rad, w, nm] of [[0.0284, 0.0006, 'ink_circle_outer'], [0.0268, 0.0004, 'ink_circle_inner']]) {
    const c = mesh(new THREE.RingGeometry(rad - w, rad, 96), M.ink, nm);
    c.rotation.x = -Math.PI / 2;
    c.position.y = FLOOR + 0.0026;
    g.add(c);
  }

  // ---- compass rose: 8 long points + 8 short, each split light/dark ----
  const rose = new THREE.Group();
  rose.name = 'compass_rose';
  const pt = (ang, tipR, halfW, baseR) => {
    const dir = new THREE.Vector2(Math.cos(ang), Math.sin(ang));
    const per = new THREE.Vector2(-dir.y, dir.x);
    return {
      tip: dir.clone().multiplyScalar(tipR),
      l: dir.clone().multiplyScalar(baseR).add(per.clone().multiplyScalar(halfW)),
      r: dir.clone().multiplyScalar(baseR).add(per.clone().multiplyScalar(-halfW)),
    };
  };
  const tri = (a, b, c) => {
    const s = new THREE.Shape();
    s.moveTo(a.x, a.y); s.lineTo(b.x, b.y); s.lineTo(c.x, c.y); s.closePath();
    return s;
  };
  const O = new THREE.Vector2(0, 0);

  for (let i = 0; i < 16; i++) {
    const ang = (i / 16) * Math.PI * 2 + Math.PI / 2;
    const long = i % 2 === 0;
    const p = pt(ang, long ? 0.0256 : 0.0148, long ? 0.0046 : 0.0034, long ? 0.0012 : 0.0010);
    const k = String(i).padStart(2, '0');
    // ink ground slightly larger than the point — reads as the engraved outline
    const o = pt(ang, long ? 0.0262 : 0.0154, long ? 0.0054 : 0.0041, long ? 0.0010 : 0.0008);
    rose.add(flat(tri(o.tip, o.l, o.r), 0.0006, FLOOR + 0.0030, `rose_point_${k}_outline`, M.ink));
    rose.add(flat(tri(p.tip, p.l, O), 0.0007, FLOOR + 0.0036, `rose_point_${k}_dark`, M.ink));
    rose.add(flat(tri(p.tip, O, p.r), 0.0007, FLOOR + 0.0036, `rose_point_${k}_light`, M.paperWhite));
  }
  // north marker: slim dark spear beyond the rose
  const npk = pt(Math.PI / 2, 0.0248, 0.0022, 0.0180);
  rose.add(flat(tri(npk.tip, npk.l, npk.r), 0.0008, FLOOR + 0.0038, 'north_marker', M.ink));
  g.add(rose);

  // ---- needles ----
  const needle = (ang, len, name) => {
    const dir = new THREE.Vector2(Math.cos(ang), Math.sin(ang));
    const per = new THREE.Vector2(-dir.y, dir.x);
    const s = new THREE.Shape();
    const tip = dir.clone().multiplyScalar(len);
    const tail = dir.clone().multiplyScalar(-0.0055);
    const w1 = dir.clone().multiplyScalar(len * 0.30).add(per.clone().multiplyScalar(0.0030));
    const w2 = dir.clone().multiplyScalar(len * 0.30).add(per.clone().multiplyScalar(-0.0030));
    s.moveTo(tip.x, tip.y); s.lineTo(w1.x, w1.y); s.lineTo(tail.x, tail.y); s.lineTo(w2.x, w2.y); s.closePath();
    return flat(s, 0.0013, FLOOR + 0.0062, name, M.ink);
  };
  g.add(needle(Math.PI / 2 + 0.28, 0.0322, 'needle_north'));
  g.add(needle(-0.62, 0.0316, 'needle_sight'));

  // ---- centre hub ----
  const hubRing = mesh(new THREE.CylinderGeometry(0.0072, 0.0072, 0.0022, 48), M.brassDark, 'hub_ring');
  hubRing.position.y = FLOOR + 0.0046;
  g.add(hubRing);
  const rosette = new THREE.Group();
  rosette.name = 'hub_rosette';
  for (let i = 0; i < 32; i++) {
    const a = (i / 32) * Math.PI * 2;
    const s = mesh(new THREE.BoxGeometry(0.0008, 0.0006, 0.0022), M.brass, `rosette_${String(i).padStart(2, '0')}`);
    s.position.set(Math.cos(a) * 0.0060, FLOOR + 0.0060, Math.sin(a) * 0.0060);
    s.rotation.y = -a;
    rosette.add(s);
  }
  g.add(rosette);
  const cap = mesh(new THREE.CylinderGeometry(0.0036, 0.0042, 0.0024, 40), M.brass, 'pivot_cap');
  cap.position.y = FLOOR + 0.0074;
  g.add(cap);
  const pivot = mesh(new THREE.SphereGeometry(0.0022, 32, 20), M.brassDark, 'pivot_jewel');
  pivot.position.y = FLOOR + 0.0088;
  g.add(pivot);

  // ---- glass ----
  const glass = mesh(new THREE.CylinderGeometry(0.0390, 0.0390, 0.0012, 96), M.glass, 'crystal_glass');
  glass.position.y = RIM_Y - 0.0014;
  glass.castShadow = false;
  g.add(glass);

  return g;
}
