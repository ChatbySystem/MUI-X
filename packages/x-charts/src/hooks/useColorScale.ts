'use client';
import * as React from 'react';
import { AxisId, AxisScaleComputedConfig, ScaleName } from '../models/axis';
import { ZAxisContext } from '../context/ZAxisContextProvider';
import { useXAxis, useYAxis } from './useAxis';

/**
 * Get the X axis color scale.
 *
 * @param {AxisId | undefined} axisId - If provided returns color scale for axisId, else returns the values for the default axis.
 * @returns {AxisScaleComputedConfig[S]['colorScale'] | undefined} The color scale for the specified X axis, or undefined if not found.
 */
export function useXColorScale<S extends ScaleName>(
  axisId?: AxisId,
): AxisScaleComputedConfig[S]['colorScale'] | undefined {
  const axis = useXAxis(axisId);

  return axis.colorScale;
}

/**
 * Get the Y axis color scale.
 *
 * @param {AxisId | undefined} axisId - If provided returns color scale for axisId, else returns the values for the default axis.
 * @returns {AxisScaleComputedConfig[S]['colorScale'] | undefined} The color scale for the specified Y axis, or undefined if not found.
 */
export function useYColorScale<S extends ScaleName>(
  axisId?: AxisId,
): AxisScaleComputedConfig[S]['colorScale'] | undefined {
  const axis = useYAxis(axisId);

  return axis.colorScale;
}

/**
 * Get the Z axis color scale.
 *
 * @param {AxisId | undefined} axisId - If provided returns color scale for axisId, else returns the values for the default axis.
 * @returns {AxisScaleComputedConfig[S]['colorScale'] | undefined} The color scale for the specified Z axis, or undefined if not found.
 */
export function useZColorScale<S extends ScaleName>(
  axisId?: AxisId,
): AxisScaleComputedConfig[S]['colorScale'] | undefined {
  const { zAxis, zAxisIds } = React.useContext(ZAxisContext);

  const id = axisId ?? zAxisIds[0];

  return zAxis[id]?.colorScale;
}
