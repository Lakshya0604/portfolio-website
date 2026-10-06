import { useEffect, useRef } from "react";
import * as THREE from "three";

/* Hero 3D scene: a glowing faceted crystal, orbit rings and a particle field.
   Mounted only on capable devices (see canUse3D in App.jsx). */
export default function Scene3D() {
  const mount = useRef(null);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    const small = window.innerWidth < 768;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !small, powerPreference: "low-power" });
    } catch (e) {
      el.dataset.failed = "1";
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "width:100%;height:100%;display:block";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 11.5);

    const group = new THREE.Group();
    scene.add(group);

    const css = getComputedStyle(document.documentElement);
    const col = (n) => {
      const [r, g, b] = css.getPropertyValue("--" + n).trim().split(/\s+/).map(Number);
      return new THREE.Color(r / 255, g / 255, b / 255);
    };
    const cViolet = col("violet"), cTeal = col("teal"), cPink = col("pink");

    // core crystal
    const geo = new THREE.IcosahedronGeometry(1.55, 1);
    const core = new THREE.Mesh(
      geo,
      new THREE.MeshStandardMaterial({ color: cViolet, metalness: 0.75, roughness: 0.22, flatShading: true, emissive: cViolet, emissiveIntensity: 0.22 })
    );
    group.add(core);
    const wire = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.95, 1)),
      new THREE.LineBasicMaterial({ color: cTeal, transparent: true, opacity: 0.55 })
    );
    group.add(wire);

    // rings
    const mkRing = (r, color, op, tilt) => {
      const m = new THREE.Mesh(new THREE.TorusGeometry(r, 0.012, 8, 80), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: op }));
      m.rotation.set(tilt[0], tilt[1], 0);
      group.add(m);
      return m;
    };
    const r1 = mkRing(2.6, cPink, 0.55, [1.2, 0.3]);
    const r2 = mkRing(3.1, cTeal, 0.35, [0.5, -0.8]);

    // small orbiting satellites
    const sats = [];
    for (let i = 0; i < 3; i++) {
      const s = new THREE.Mesh(new THREE.OctahedronGeometry(0.11), new THREE.MeshBasicMaterial({ color: [cPink, cTeal, cViolet][i] }));
      group.add(s);
      sats.push(s);
    }

    // particles
    const N = 180;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const r = 3.4 + Math.random() * 5;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.7;
      pos[i * 3 + 2] = r * Math.cos(ph) - 1;
    }
    const pg = new THREE.BufferGeometry();
    pg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const pts = new THREE.Points(pg, new THREE.PointsMaterial({ size: small ? 0.035 : 0.03, color: cTeal, transparent: true, opacity: 0.75, depthWrite: false }));
    scene.add(pts);

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const l1 = new THREE.PointLight(cPink, 38, 20); l1.position.set(4, 3, 5); scene.add(l1);
    const l2 = new THREE.PointLight(cTeal, 30, 20); l2.position.set(-5, -2, 4); scene.add(l2);

    const themeObserver = new MutationObserver(() => {
      const cs = getComputedStyle(document.documentElement);
      const current = (n) => new THREE.Color(...cs.getPropertyValue("--" + n).trim().split(/\s+/).map(x => Number(x) / 255));
      core.material.color.copy(current("violet")); core.material.emissive.copy(current("violet"));
      wire.material.color.copy(current("teal")); pts.material.color.copy(current("teal"));
      r1.material.color.copy(current("pink")); r2.material.color.copy(current("teal"));
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const resize = () => {
      const w = el.clientWidth || 1, h = el.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      group.position.x = w > 900 ? 2.6 : 0;
      group.scale.setScalar(w > 900 ? 1 : 0.8);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const target = { x: 0, y: 0 };
    const onMove = (e) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0, visible = true, t0 = performance.now(), lastFrame = 0;
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible && !document.hidden && !raf) raf = requestAnimationFrame(tick); });
    io.observe(el);
    const onVis = () => { if (!document.hidden && !raf) raf = requestAnimationFrame(tick); };
    document.addEventListener("visibilitychange", onVis);

    function tick(now) {
      raf = 0;
      if (document.hidden || !visible) return;
      if (now - lastFrame < 33.3) { raf = requestAnimationFrame(tick); return; }
      lastFrame = now;
      if (visible) {
        const t = (now - t0) / 1000;
        core.rotation.y = t * 0.32;
        core.rotation.x = t * 0.18;
        wire.rotation.y = -t * 0.14;
        wire.rotation.z = t * 0.09;
        r1.rotation.z = t * 0.25;
        r2.rotation.z = -t * 0.18;
        sats.forEach((s, i) => {
          const a = t * (0.6 + i * 0.25) + i * 2.1;
          const R = 2.4 + i * 0.4;
          s.position.set(Math.cos(a) * R, Math.sin(a * 1.3) * 1.2, Math.sin(a) * R * 0.6);
          s.rotation.x = t; s.rotation.y = t * 1.3;
        });
        pts.rotation.y = t * 0.025;
        group.position.y = Math.sin(t * 0.8) * 0.12;
        group.rotation.y += (target.x * 0.5 - group.rotation.y) * 0.04;
        group.rotation.x += (target.y * 0.3 - group.rotation.x) * 0.04;
        renderer.render(scene, camera);
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    el.dataset.ready = "1";

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect(); themeObserver.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      scene.traverse((o) => { o.geometry?.dispose?.(); o.material?.dispose?.(); });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mount} className="scene3d" aria-hidden="true" />;
}
