'use client';
import * as React from 'react';
import { useCartesianContext } from '../context/CartesianProvider';
import { AxisScaleComputedConfig, ScaleName } from '../models/axis';
import { ZAxisContext } from '../context/ZAxisContextProvider';

/**
 * Get the X axis color scale.
 *
 * @param {string | undefined} axisId - If provided returns color scale for axisId, else returns the values for the default axis.
 * @returns {AxisScaleComputedConfig[S]['colorScale'] | undefined} The color scale for the specified X axis, or undefined if not found.
 */
export function useXColorScale<S extends ScaleName>(
  axisId?: string,
): AxisScaleComputedConfig[S]['colorScale'] | undefined {
  const { xAxis, xAxisIds } = useCartesianContext();

  const id = typeof axisId === 'string' ? axisId : xAxisIds[0];

  return xAxis[id].colorScale;
}

/**
 * Get the Y axis color scale.
 *
 * @param {string | undefined} axisId - If provided returns color scale for axisId, else returns the values for the default axis.
 * @returns {AxisScaleComputedConfig[S]['colorScale'] | undefined} The color scale for the specified Y axis, or undefined if not found.
 */
export function useYColorScale<S extends ScaleName>(
  axisId?: string,
): AxisScaleComputedConfig[S]['colorScale'] | undefined {
  const { yAxis, yAxisIds } = useCartesianContext();

  const id = typeof axisId === 'string' ? axisId : yAxisIds[0];

  return yAxis[id].colorScale;
}

/**
 * Get the Z axis color scale.
 *
 * @param {string | undefined} axisId - If provided returns color scale for axisId, else returns the values for the default axis.
 * @returns {AxisScaleComputedConfig[S]['colorScale'] | undefined} The color scale for the specified Z axis, or undefined if not found.
 */
export function useZColorScale<S extends ScaleName>(
  axisId?: string,
): AxisScaleComputedConfig[S]['colorScale'] | undefined {
  const { zAxis, zAxisIds } = React.useContext(ZAxisContext);

  const id = typeof axisId === 'string' ? axisId : zAxisIds[0];

  return zAxis[id]?.colorScale;
}
