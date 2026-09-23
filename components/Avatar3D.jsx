"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { STATUS } from "../lib/useVoice";
import { styles } from "../lib/styles";


export default function Avatar3D({ status }) {
  const mountRef = useRef(null);
  const statusRef = useRef(status);
  const partsRef = useRef({});

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0.05, 4.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.75));
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
    keyLight.position.set(2, 3, 4);
    scene.add(keyLight);

    const avatar = new THREE.Group();
    scene.add(avatar);

   
    const skinColor = 0xc98b5e;
    const hairColor = 0x2b1a14;
    const sweaterColor = 0xf2a6c6;
    const bowColor = 0xe0507a;
    const blushColor = 0xffb6c9;

   
    const sweaterMaterial = new THREE.MeshStandardMaterial({
      color: sweaterColor,
      roughness: 0.6,
      metalness: 0.05,
    });
    const body = new THREE.Mesh(
      new THREE.SphereGeometry(0.7, 32, 32),
      sweaterMaterial,
    );
    body.scale.set(1.25, 0.95, 0.95);
    body.position.y = -0.95;
    avatar.add(body);

   
    const pendant = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 12, 12),
      new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 0.6,
        roughness: 0.3,
      }),
    );
    pendant.position.set(0, -0.55, 0.42);
    avatar.add(pendant);

  
    const skinMaterial = new THREE.MeshStandardMaterial({
      color: skinColor,
      roughness: 0.55,
    });
    const neck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.18, 0.22, 16),
      skinMaterial,
    );
    neck.position.y = -0.25;
    avatar.add(neck);

   
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.55, 32, 32),
      skinMaterial,
    );
    head.position.y = 0.35;
    avatar.add(head);

  
    const hairMaterial = new THREE.MeshStandardMaterial({
      color: hairColor,
      roughness: 0.5,
    });

    const hairBase = new THREE.Mesh(
      new THREE.SphereGeometry(0.62, 32, 32),
      hairMaterial,
    );
    hairBase.position.set(0, 0.4, -0.08);
    avatar.add(hairBase);

    const curlGeometry = new THREE.SphereGeometry(0.16, 12, 12);
    const curlPositions = [
      [-0.55, 0.25, 0.15],
      [0.55, 0.25, 0.15],
      [-0.5, -0.05, 0.28],
      [0.5, -0.05, 0.28],
      [-0.4, 0.55, 0.35],
      [0.4, 0.55, 0.35],
      [-0.62, 0.5, -0.05],
      [0.62, 0.5, -0.05],
      [0, 0.7, -0.3],
      [-0.2, 0.72, 0.1],
      [0.2, 0.72, 0.1],
    ];
    curlPositions.forEach(([x, y, z]) => {
      const curl = new THREE.Mesh(curlGeometry, hairMaterial);
      curl.position.set(x, y, z);
      curl.scale.setScalar(0.7 + Math.random() * 0.4);
      avatar.add(curl);
    });

    const bun = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 24, 24),
      hairMaterial,
    );
    bun.position.set(0, 1.0, -0.05);
    avatar.add(bun);

   
    const bowMaterial = new THREE.MeshStandardMaterial({
      color: bowColor,
      roughness: 0.45,
    });
    const bowGeometry = new THREE.ConeGeometry(0.22, 0.12, 4);

    const bowLeft = new THREE.Mesh(bowGeometry, bowMaterial);
    bowLeft.rotation.z = Math.PI / 2;
    bowLeft.position.set(-0.16, 0.98, 0.28);
    avatar.add(bowLeft);

    const bowRight = new THREE.Mesh(bowGeometry, bowMaterial);
    bowRight.rotation.z = -Math.PI / 2;
    bowRight.position.set(0.16, 0.98, 0.28);
    avatar.add(bowRight);

    const bowKnot = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 16, 16),
      bowMaterial,
    );
    bowKnot.position.set(0, 0.98, 0.3);
    avatar.add(bowKnot);

  
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x2b1a14 });
    const eyeGeometry = new THREE.SphereGeometry(0.08, 16, 16);
    const sparkleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const sparkleGeometry = new THREE.SphereGeometry(0.02, 8, 8);

    [-0.2, 0.2].forEach((x) => {
      const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
      eye.scale.set(1, 1, 0.4);
      eye.position.set(x, 0.38, 0.48);
      avatar.add(eye);

      const sparkle = new THREE.Mesh(sparkleGeometry, sparkleMaterial);
      sparkle.position.set(x - 0.03, 0.42, 0.53);
      avatar.add(sparkle);
    });

    const blushMaterial = new THREE.MeshStandardMaterial({
      color: blushColor,
      transparent: true,
      opacity: 0.55,
    });
    const blushGeometry = new THREE.SphereGeometry(0.09, 12, 12);
    [-0.32, 0.32].forEach((x) => {
      const blush = new THREE.Mesh(blushGeometry, blushMaterial);
      blush.scale.set(1, 0.7, 0.3);
      blush.position.set(x, 0.2, 0.44);
      avatar.add(blush);
    });

    const mouthMaterial = new THREE.MeshStandardMaterial({ color: 0xb35c72 });
    const mouth = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.045, 0.045),
      mouthMaterial,
    );
    mouth.position.set(0, 0.13, 0.52);
    avatar.add(mouth);

   
    const haloMaterial = new THREE.MeshBasicMaterial({
      color: 0x4f7cff,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    });
    const halo = new THREE.Mesh(
      new THREE.RingGeometry(0.78, 0.98, 40),
      haloMaterial,
    );
    halo.position.set(0, 0.4, -0.45);
    avatar.add(halo);

    partsRef.current = { avatar, mouth, haloMaterial, blushMaterial };

    let frameId;
    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();
      const current = statusRef.current;
      const { avatar, mouth, haloMaterial, blushMaterial } = partsRef.current;

      avatar.position.y = Math.sin(t * 1.2) * 0.05;
      avatar.rotation.y = Math.sin(t * 0.4) * 0.15;

      if (current === STATUS.LISTENING) {
        haloMaterial.color.setHex(0x4f7cff);
        haloMaterial.opacity = 0.35 + Math.sin(t * 6) * 0.2;
        blushMaterial.opacity = 0.55;
      } else if (current === STATUS.THINKING) {
        avatar.rotation.y = t * 1.2;
        haloMaterial.color.setHex(0x8f7cff);
        haloMaterial.opacity = 0.5;
        blushMaterial.opacity = 0.55;
      } else if (current === STATUS.SPEAKING) {
        haloMaterial.color.setHex(0xff6f9d);
        haloMaterial.opacity = 0.4 + Math.abs(Math.sin(t * 8)) * 0.3;
        blushMaterial.opacity = 0.8;
        const mouthScale = 1 + Math.abs(Math.sin(t * 14)) * 2.2;
        mouth.scale.set(1, mouthScale, 1);
      } else {
        haloMaterial.color.setHex(0x4f7cff);
        haloMaterial.opacity = 0.25 + Math.sin(t * 2) * 0.08;
        blushMaterial.opacity = 0.55;
        mouth.scale.set(1, 1, 1);
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} style={styles.avatarWrap3d} />;
}
