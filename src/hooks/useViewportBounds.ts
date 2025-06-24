import { useMemo } from 'react';
import { useTransformContext } from 'react-zoom-pan-pinch';

export const useViewportBounds = () => {
  const transformContext = useTransformContext();
  return useMemo(() => {
    if (!transformContext.transformState) return null;

    const { positionX, positionY, scale, previousScale } =
      transformContext.transformState;

    const padding = 500;
    let xMin = Math.max(0, Math.floor(Math.abs(positionX) / scale) - padding);
    let yMin = Math.max(0, Math.floor(Math.abs(positionY) / scale) - padding);
    let xMax = Math.floor(xMin + window.innerWidth / scale) + padding;
    let yMax = Math.floor(yMin + window.innerHeight / scale) + padding;

    if (scale === 0.5) {
      xMin += padding;
      yMin += padding;
      xMax -= padding;
      yMax -= padding;
    }
    return { xMin, yMin, xMax, yMax, previousScale };
  }, [transformContext?.transformState?.previousScale]);
};
