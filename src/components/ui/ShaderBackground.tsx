"use client";

import React, { useEffect, useState } from "react";
import { ShaderGradientCanvas, ShaderGradient } from "shadergradient";

const ShaderGradientComponent = ShaderGradient as any;

export default function ShaderBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-3xl w-full h-full">
      <ShaderGradientCanvas
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        <ShaderGradientComponent
          animate="on"
          axesHelper="off"
          brightness={1.3}
          cAzimuthAngle={230}
          cDistance={4.11}
          cPolarAngle={70}
          cameraZoom={1}
          color1="#aaff3b"
          color2="#6ec74e"
          color3="#00ce00"
          destination="onCanvas"
          embedMode="off"
          envPreset="city"
          format="gif"
          fov={40}
          frameRate={10}
          gizmoHelper="hide"
          grain="on"
          lightType="3d"
          pixelDensity={1}
          positionX={-1.4}
          positionY={0}
          positionZ={0}
          range="disabled"
          rangeEnd={40}
          rangeStart={13.1}
          reflection={0.1}
          rotationX={0}
          rotationY={10}
          rotationZ={50}
          shader="defaults"
          type="plane"
          uAmplitude={1}
          uDensity={1.3}
          uFrequency={5.5}
          uSpeed={0.3}
          uStrength={4}
          uTime={13.1}
          wireframe={false}
        />
      </ShaderGradientCanvas>
    </div>
  );
}
