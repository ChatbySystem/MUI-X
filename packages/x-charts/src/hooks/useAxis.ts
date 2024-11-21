'use client';
import { useCartesianContext } from '../context/CartesianProvider';

/**
 * Get the X axis.
 * @param {string | undefined} axisId - If provided returns the x axis with axisId, else returns the values for the default x axis.
 * @returns The X axis.
 */
export function useXAxis(axisId?: string) {
  const { xAxis, xAxisIds } = useCartesianContext();

  const id = typeof axisId === 'string' ? axisId : xAxisIds[0];

  return xAxis[id];
}

/**
 * Get the Y axis.
 * @param {string | undefined} axisId - If provided returns the y axis with axisId, else returns the values for the default y axis.
 * @returns The Y axis.
 */
export function useYAxis(axisId?: string) {
  const { yAxis, yAxisIds } = useCartesianContext();

  const id = typeof axisId === 'string' ? axisId : yAxisIds[0];

  return yAxis[id];
}
