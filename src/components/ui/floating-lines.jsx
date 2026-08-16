import { useEffect, useRef } from 'react';
import {
  Scene, OrthographicCamera, WebGLRenderer, PlaneGeometry, Mesh,
  ShaderMaterial, Vector3, Vector2, Clock,
} from 'three';

const vertexShader = `precision highp float; void main(){ gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`;

const fragmentShader = `precision highp float;
uniform float iTime; uniform vec3 iResolution; uniform float animationSpeed;
uniform int lineCount; uniform float lineDistance;
uniform vec2 iMouse; uniform bool interactive; uniform float bendStrength; uniform float bendInfluence;
uniform vec3 lineGradient[6]; uniform int lineGradientCount;
mat2 rotate(float r){ return mat2(cos(r),sin(r),-sin(r),cos(r)); }
vec3 getLineColor(float t){
  if(lineGradientCount<=1) return lineGradient[0];
  float ct = clamp(t,0.0,0.9999);
  float scaled = ct*float(lineGradientCount-1);
  int idx = int(floor(scaled));
  float f = fract(scaled);
  int idx2 = min(idx+1, lineGradientCount-1);
  return mix(lineGradient[idx], lineGradient[idx2], f) * 0.6;
}
float wave(vec2 uv, float offset, vec2 mouseUv, bool shouldBend){
  float time = iTime*animationSpeed;
  float amp = sin(offset+time*0.2)*0.3;
  float y = sin(uv.x+offset+time*0.1)*amp;
  if(shouldBend){
    vec2 d = uv-mouseUv;
    float influence = exp(-dot(d,d)*5.0);
    y += (mouseUv.y-uv.y)*influence*bendStrength*bendInfluence;
  }
  float m = uv.y-y;
  return 0.0175/max(abs(m)+0.01,1e-3)+0.01;
}
void main(){
  vec2 uv = (2.0*gl_FragCoord.xy-iResolution.xy)/iResolution.y;
  uv.y *= -1.0;
  vec2 mouseUv = vec2(0.0);
  if(interactive){ mouseUv = (2.0*iMouse-iResolution.xy)/iResolution.y; mouseUv.y *= -1.0; }
  vec3 col = vec3(0.0);
  for(int i=0;i<12;i++){
    if(i>=lineCount) break;
    float fi = float(i);
    float t = fi/max(float(lineCount-1),1.0);
    vec3 lineCol = getLineColor(t);
    float angle = 0.2*log(length(uv)+1.0);
    vec2 ruv = uv*rotate(angle);
    col += lineCol * wave(ruv+vec2(lineDistance*fi, 0.0), 1.5+0.2*fi, uv, interactive);
  }
  gl_FragColor = vec4(col, 1.0);
}`;

function hexToVec3(hex) {
  let v = hex.trim().replace('#', '');
  if (v.length === 3) v = v.split('').map(c => c + c).join('');
  return new Vector3(parseInt(v.slice(0, 2), 16) / 255, parseInt(v.slice(2, 4), 16) / 255, parseInt(v.slice(4, 6), 16) / 255);
}

export default function FloatingLines({
  linesGradient = ['#FF5C28', '#6B7FFF'],
  lineCount = 6,
  lineDistance = 0.08,
  animationSpeed = 0.8,
  interactive = true,
  bendStrength = -0.4,
  mouseDamping = 0.06,
  mixBlendMode = 'screen',
}) {
  const containerRef = useRef(null);
  const targetMouse = useRef(new Vector2(-1000, -1000));
  const currentMouse = useRef(new Vector2(-1000, -1000));
  const targetInfluence = useRef(0);
  const currentInfluence = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const scene = new Scene();
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    camera.position.z = 1;
    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    containerRef.current.appendChild(renderer.domElement);

    const grad = linesGradient.slice(0, 6).map(hexToVec3);
    while (grad.length < 6) grad.push(new Vector3(1, 1, 1));

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new Vector3(1, 1, 1) },
      animationSpeed: { value: animationSpeed },
      lineCount: { value: lineCount },
      lineDistance: { value: lineDistance },
      iMouse: { value: new Vector2(-1000, -1000) },
      interactive: { value: interactive },
      bendStrength: { value: bendStrength },
      bendInfluence: { value: 0 },
      lineGradient: { value: grad },
      lineGradientCount: { value: linesGradient.length },
    };

    const material = new ShaderMaterial({ uniforms, vertexShader, fragmentShader, transparent: true });
    const mesh = new Mesh(new PlaneGeometry(2, 2), material);
    scene.add(mesh);

    const clock = new Clock();
    const setSize = () => {
      const el = containerRef.current;
      if (!el) return;
      const w = el.clientWidth || 1;
      const h = el.clientHeight || 1;
      renderer.setSize(w, h, false);
      uniforms.iResolution.value.set(renderer.domElement.width, renderer.domElement.height, 1);
    };
    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(containerRef.current);

    const onMove = (e) => {
      const r = renderer.domElement.getBoundingClientRect();
      const dpr = renderer.getPixelRatio();
      targetMouse.current.set((e.clientX - r.left) * dpr, (r.height - (e.clientY - r.top)) * dpr);
      targetInfluence.current = 1;
    };
    const onLeave = () => { targetInfluence.current = 0; };
    if (interactive) {
      renderer.domElement.addEventListener('pointermove', onMove);
      renderer.domElement.addEventListener('pointerleave', onLeave);
    }

    let raf = 0;
    const loop = () => {
      uniforms.iTime.value = clock.getElapsedTime();
      if (interactive) {
        currentMouse.current.lerp(targetMouse.current, mouseDamping);
        uniforms.iMouse.value.copy(currentMouse.current);
        currentInfluence.current += (targetInfluence.current - currentInfluence.current) * mouseDamping;
        uniforms.bendInfluence.value = currentInfluence.current;
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (interactive) {
        renderer.domElement.removeEventListener('pointermove', onMove);
        renderer.domElement.removeEventListener('pointerleave', onLeave);
      }
      mesh.geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement) renderer.domElement.parentElement.removeChild(renderer.domElement);
    };
  }, [linesGradient, lineCount, lineDistance, animationSpeed, interactive, bendStrength, mouseDamping]);

  return <div ref={containerRef} className="w-full h-full relative overflow-hidden" style={{ mixBlendMode }} />;
}
