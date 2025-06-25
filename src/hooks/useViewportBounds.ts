import { useMemo } from 'react';
import { useTransformContext } from 'react-zoom-pan-pinch';

export const useViewportBounds = () => {
  const transformContext = useTransformContext();
  return useMemo(() => {
    if (!transformContext.transformState) return null;

    const { positionX, positionY, scale, previousScale } =
      transformContext.transformState;

    const xMin = Math.max(0, Math.floor(Math.abs(positionX) / scale));
    const yMin = Math.max(0, Math.floor(Math.abs(positionY) / scale));
    const xMax = Math.floor(xMin + window.innerWidth / scale);
    const yMax = Math.floor(yMin + window.innerHeight / scale);

    return { xMin, yMin, xMax, yMax, previousScale };
  }, [transformContext?.transformState?.previousScale]);
};
