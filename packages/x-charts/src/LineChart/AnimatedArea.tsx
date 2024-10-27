'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { animated, useTransition } from '@react-spring/web';
import { color as d3Color } from '@mui/x-charts-vendor/d3-color';
import type { AreaElementOwnerState } from './AreaElement';
import { useStringInterpolator } from '../internals/useStringInterpolator';
import { AppearingMask } from './AppearingMask';

export const AreaElementPath = styled(animated.path, {
  name: 'MuiAreaElement',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: AreaElementOwnerState }>(({ ownerState }) => ({
  stroke: 'none',
  fill:
    (ownerState.gradientId && `url(#${ownerState.gradientId})`) ||
    (ownerState.isHighlighted && d3Color(ownerState.color)!.brighter(1).formatHex()) ||
    d3Color(ownerState.color)!.brighter(0.5).formatHex(),
  transition: 'opacity 0.2s ease-in, fill 0.2s ease-in',
  opacity: ownerState.isFaded ? 0.3 : 1,
}));

export interface AnimatedAreaProps extends React.ComponentPropsWithoutRef<'path'> {
  ownerState: AreaElementOwnerState;
  d: string;
  /**
   * If `true`, animations are skipped.
   * @default false
   */
  skipAnimation?: boolean;
}

/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Areas demonstration](https://mui.com/x/react-charts/areas-demo/)
 *
 * API:
 *
 * - [AreaElement API](https://mui.com/x/api/charts/animated-area/)
 */
function AnimatedArea(props: AnimatedAreaProps) {
  const { d, skipAnimation, ownerState, ...other } = props;

  const stringInterpolator = useStringInterpolator(d);

  const transitionChange = useTransition([stringInterpolator], {
    from: { value: 0 },
    to: { value: 1 },
    enter: { value: 1 },
    reset: false,
    immediate: skipAnimation,
  });

  return (
    <AppearingMask skipAnimation={skipAnimation} id={`${ownerState.id}-area-clip`}>
      {transitionChange((style, interpolator) => (
        <AreaElementPath {...other} ownerState={ownerState} d={style.value.to(interpolator)} />
      ))}
    </AppearingMask>
  );
}

AnimatedArea.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  d: PropTypes.string.isRequired,
  ownerState: PropTypes.shape({
    classes: PropTypes.object,
    color: PropTypes.string.isRequired,
    gradientId: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    isFaded: PropTypes.bool.isRequired,
    isHighlighted: PropTypes.bool.isRequired,
  }).isRequired,
  /**
   * If `true`, animations are skipped.
   * @default false
   */
  skipAnimation: PropTypes.bool,
} as any;

export { AnimatedArea };