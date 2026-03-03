'use client';

import { useEffect, useState, useCallback } from "react";
import { RuntimeLoader } from "@rive-app/canvas";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";

RuntimeLoader.setWasmUrl('/rive.wasm');

export default function RiveAnimation({
  src,
  className,
  label,
  onRiveReady,
  fit = Fit.Contain,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !src) {
    return <div className={className} />;
  }

  return <RiveCanvas src={src} className={className} label={label} onRiveReady={onRiveReady} fit={fit} />;
}

function RiveCanvas({ src, className, label, onRiveReady, fit }) {
  const { rive, RiveComponent } = useRive({
    src,
    autoplay: false,
    layout: new Layout({ fit, alignment: Alignment.Center }),
  });

  useEffect(() => {
    if (rive) {
      if (rive.stateMachineNames.length > 0) {
        rive.play(rive.stateMachineNames);
      } else if (rive.animationNames.length > 0) {
        rive.play(rive.animationNames);
      }
      onRiveReady?.(rive);
    }
  }, [rive]);

  return <RiveComponent className={className} aria-label={label} />;
}
