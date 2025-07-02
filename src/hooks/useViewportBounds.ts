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

    let xMin = Math.max(0, Math.floor(Math.abs(positionX) / scale));
    let yMin = Math.max(0, Math.floor(Math.abs(positionY) / scale));
    let xMax = Math.floor(xMin + window.innerWidth / scale);
    let yMax = Math.floor(yMin + window.innerHeight / scale);

    const padding = 400;

    if (xMin > 400) xMin -= padding;
    if (yMin > 400) yMin -= padding;
    if (xMax < 4599) xMax += padding;
    if (yMax < 2399) yMax += padding;

    const latestBounds = { xMin, yMin, xMax, yMax, scale };
    setBounds(latestBounds);
  }, [
    transformContext?.transformState?.scale,
    transformContext?.transformState?.positionX,
    transformContext?.transformState?.positionY,
  ]);

  return bounds;
};
