import { useMemo, useState } from 'react';
import { useTransformContext } from 'react-zoom-pan-pinch';

export const useViewportBounds = () => {
  const [bounds, setBounds] = useState({
    xMin: 0,
    yMin: 0,
    xMax: 4999,
    yMax: 2799,
    scale: 1,
  });

  const transformContext = useTransformContext();

  useMemo(() => {
    if (!transformContext?.transformState) return;

    const { positionX, positionY, scale } = transformContext.transformState;

    const xMin = Math.max(0, Math.floor(Math.abs(positionX) / scale));
    const yMin = Math.max(0, Math.floor(Math.abs(positionY) / scale));
    const xMax = Math.floor(xMin + window.innerWidth / scale);
    const yMax = Math.floor(yMin + window.innerHeight / scale);

    const latestBounds = { xMin, yMin, xMax, yMax, scale };
    setBounds(latestBounds);
  }, [
    transformContext?.transformState?.scale,
    transformContext?.transformState?.positionX,
    transformContext?.transformState?.positionY,
  ]);

  return bounds;
};
