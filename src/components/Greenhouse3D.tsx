import React, { Suspense, useEffect, useRef, Component, ErrorInfo, ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Html } from "@react-three/drei";
import { ArrowUp } from "lucide-react";

// Error Boundary specifically to handle 3D loader failures gracefully
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ThreeErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("3D Model loading error, falling back to procedural cyber-dome:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Beautiful procedural 3D Martian Greenhouse fallback
export function ProceduralGreenhouse() {
  const groupRef = useRef<any>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.04;
    }
  });

  return (
    <group ref={groupRef} position={[0, -2, 0]}>
      {/* Deep Rich Martian Mud / Agricultural Soil base */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <cylinderGeometry args={[5, 5, 0.35, 32]} />
        <meshStandardMaterial color="#1a1210" roughness={0.9} bumpScale={0.1} />
      </mesh>

      {/* High-Tech Slate/Metallic rim with gold accents */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[5.1, 5.1, 0.2, 32]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.25} />
      </mesh>

      {/* Neon Cyan Active Biosphere Outer Ring */}
      <mesh position={[0, 0.42, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.92, 5.0, 48]} />
        <meshBasicMaterial color="#0097ab" toneMapped={false} />
      </mesh>

      {/* Aeroponic Growth Column Core */}
      <mesh position={[0, 2.8, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.55, 4.8, 16]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Central Bioluminescent Fusion Core (glowing capsule) */}
      <mesh position={[0, 2.8, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 1.4, 16]} />
        <meshBasicMaterial color="#0097ab" transparent opacity={0.5} />
      </mesh>
      <mesh position={[0, 2.8, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 1.6, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>

      {/* 3 Tiered Hydroponic Shelf Rings */}
      {[1, 2, 3].map((yVal, idx) => (
        <group key={idx} position={[0, yVal * 1.15, 0]}>
          {/* Carbon Fiber Hydroponic Shelf */}
          <mesh>
            <cylinderGeometry args={[2.4, 2.4, 0.1, 24]} />
            <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.3, 2.38, 24]} />
            <meshBasicMaterial color="#0097ab" toneMapped={false} />
          </mesh>
          
          {/* Glowing Hydroponic Bio-Pods */}
          {[0, 1, 2, 3, 4, 5].map((item, iIdx) => {
            const angle = (iIdx / 6) * Math.PI * 2;
            const radius = 1.75;
            const x = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius;
            return (
              <group key={iIdx} position={[x, 0.22, z]}>
                {/* Bio Pod Pot */}
                <mesh castShadow>
                  <cylinderGeometry args={[0.22, 0.14, 0.32, 8]} />
                  <meshStandardMaterial color="#334155" roughness={0.4} />
                </mesh>
                {/* Bioluminescent core bulb */}
                <mesh position={[0, 0.2, 0]}>
                  <sphereGeometry args={[0.14, 8, 8]} />
                  <meshBasicMaterial color={idx % 2 === 0 ? "#10b981" : "#0097ab"} />
                </mesh>
                {/* Stylized geometric crop foliage */}
                <mesh position={[0, 0.32, 0]} rotation={[0.1, 0, 0.15]}>
                  <coneGeometry args={[0.06, 0.35, 4]} />
                  <meshStandardMaterial color="#10b981" roughness={0.25} />
                </mesh>
                <mesh position={[0.06, 0.3, -0.06]} rotation={[-0.2, 0.5, -0.1]}>
                  <coneGeometry args={[0.04, 0.28, 4]} />
                  <meshStandardMaterial color="#059669" roughness={0.25} />
                </mesh>
                <mesh position={[-0.06, 0.3, 0.06]} rotation={[0.3, -0.4, 0.1]}>
                  <coneGeometry args={[0.04, 0.28, 4]} />
                  <meshStandardMaterial color="#059669" roughness={0.25} />
                </mesh>
                <pointLight position={[0, 0.2, 0]} distance={1.2} intensity={0.4} color="#0097ab" />
              </group>
            );
          })}
        </group>
      ))}

      {/* Cybernetic dome structure - high contrast ribs */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <sphereGeometry args={[5, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial 
          color="#334155" 
          wireframe 
          transparent 
          opacity={0.25} 
        />
      </mesh>

      {/* Clean high-contrast structural orbital arches */}
      {[0, 45, 90, 135].map((rotDeg, idx) => (
        <group key={idx} rotation={[0, (rotDeg * Math.PI) / 180, 0]}>
          <mesh position={[0, 2.5, 0]}>
            <torusGeometry args={[5, 0.05, 8, 36, Math.PI]} />
            <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Translucent protective thermal glass layer */}
      <mesh position={[0, 0.18, 0]}>
        <sphereGeometry args={[4.94, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.22]} />
        <meshStandardMaterial 
          color="#0097ab" 
          transparent 
          opacity={0.08} 
          roughness={0.1}
          metalness={0.2}
        />
      </mesh>
    </group>
  );
}

export function CameraRig() {
  const { camera, gl } = useThree();

  const radius = useRef(16);

  useEffect(() => {
    const canvas = gl.domElement;

    const handleWheel = (event: WheelEvent) => {
      radius.current += event.deltaY * 0.01;

      // Limites do zoom
      radius.current = Math.max(
        8,
        Math.min(16, radius.current)
      );
    };

    canvas.addEventListener("wheel", handleWheel, {
      passive: true,
    });

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, [gl]);

  useFrame(({ mouse }) => {
    // Zoom mais perto = mais liberdade
    const zoomFactor =
      (16 - radius.current) / (16 - 8);

    const minAngle = 0.3;
    const maxAngle = 0.6;

    const angleRange =
      minAngle +
      (maxAngle - minAngle) * zoomFactor;

    const angle = mouse.x * angleRange;

    const targetX =
      Math.sin(angle) * radius.current;

    const targetZ =
      Math.cos(angle) * radius.current;

    camera.position.x +=
      (targetX - camera.position.x) * 0.05;

    camera.position.z +=
      (targetZ - camera.position.z) * 0.05;

    camera.position.y = 2;

    camera.lookAt(0, 2, 0);
  });

  return null;
}

export function Greenhouse() {
  const { scene } = useGLTF("/models/Teste23d.glb");

  return (
    <primitive
      object={scene}
      scale={100}
      position={[-1, 0, 0]}
    />
  );
}

export function Lights() {
  return (
    <>
      <ambientLight intensity={0.4} />

      <directionalLight
        castShadow
        position={[30, 20, 10]}
        intensity={4}
        color="#ffb56b"
      />

      <directionalLight
        position={[-15, 8, -10]}
        intensity={1}
        color="#8ab8ff"
      />

      <pointLight
        position={[0, 5, 0]}
        intensity={8}
        color="#7de3ff"
      />

      <hemisphereLight
        color="#ffb56b"
        groundColor="#030510"
        intensity={0.8}
      />
    </>
  );
}

function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center p-6 bg-cosmic/90 rounded-xl border border-mars/20 text-center space-y-4 max-w-sm">
        <div className="w-10 h-10 border-4 border-t-neon border-r-mars border-b-mars-dark border-l-slate-800 rounded-full animate-spin"></div>
        <div>
          <h5 className="text-neon font-display font-medium text-xs tracking-wider uppercase">Projeção Holográfica 3D</h5>
          <p className="text-[10px] text-slate-400 mt-1 font-mono">Carregando Modelo Bioregenerativo (12.9 MB)</p>
        </div>
      </div>
    </Html>
  );
}

export default function Greenhouse3D() {
  const handleScrollUp = () => {
    const target = document.getElementById("como-funciona") || document.getElementById("hero");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full h-[500px] md:h-[650px] bg-[#030510] overflow-hidden shadow-2xl flex flex-col justify-end">
      {/* 3D Canvas rendering at port 3000 */}
      <div className="absolute inset-0">
        <ThreeErrorBoundary fallback={
          <Canvas
            shadows
            camera={{ position: [0, 2, 16], fov: 45 }}
            gl={{ antialias: true }}
            style={{ width: "100%", height: "100%" }}
          >
            <Suspense fallback={<Loader />}>
              <ProceduralGreenhouse />
              <Lights />
              <CameraRig />
            </Suspense>
          </Canvas>
        }>
          <Canvas
            shadows
            camera={{ position: [0, 2, 16], fov: 45 }}
            gl={{ antialias: true }}
            style={{ width: "100%", height: "100%" }}
          >
            <Suspense fallback={<Loader />}>
              <Greenhouse />
              <Lights />
              <CameraRig />
            </Suspense>
          </Canvas>
        </ThreeErrorBoundary>
      </div>

      {/* Mandatory Overlays & Masking */}
      <div 
        className="absolute inset-0 pointer-events-none z-10 mix-blend-color-burn" 
        style={{ backgroundColor: "rgba(255,120,40,0.18)" }}
      />
      
      {/* Tech Interface Details for premium visual touch */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-cosmic via-cosmic/40 to-transparent h-40 pointer-events-none z-15" />
      
      {/* Dynamic HUD Layout for agricultural / space theme */}
      <div className="absolute top-4 left-4 right-4 z-20 pointer-events-none flex flex-col md:flex-row justify-between items-start space-y-3 md:space-y-0">
        <div className="bg-[#030510]/80 backdrop-blur-md p-3 rounded border border-mars/30 max-w-[280px] md:max-w-xs pointer-events-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-neon rounded-full animate-pulse"></span>
            <span className="text-[9px] font-mono tracking-widest text-neon uppercase">Módulo Holográfico</span>
          </div>
          <h4 className="text-sm font-display font-semibold mt-1 text-white">Visualizador Bioregenerativo M1</h4>
          <p className="text-[11px] text-slate-400 mt-1 font-sans leading-relaxed">
            Mova o mouse lateralmente para orbitar a estufa. Use o scroll para aproximar os detalhes das membranas térmicas e sistema aeropônico.
          </p>
        </div>

        <div className="bg-[#030510]/80 backdrop-blur-md p-3 rounded border border-neon/20 font-mono text-[9px] text-slate-400 space-y-1 md:text-right pointer-events-auto">
          <div className="font-semibold text-neon border-b border-neon/10 pb-1 mb-1">TELEMETRIA MARTIS OS</div>
          <div>ESTUFA MODULAR: <span className="text-white">COURO DE CO2 ATIVO</span></div>
          <div>SISTEMA AEROPÔNICO: <span className="text-white">95% CICLO FECHADO</span></div>
          <div>CÂMARA BIOSTASE: <span className="text-white">LIOFILIZAÇÃO PRONTA</span></div>
          <div>ASTRA-AI AGENTE: <span className="text-neon">PREDIÇÃO OPERACIONAL</span></div>
        </div>
      </div>
    </div>
  );
}
