import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useSize } from '../context/SizeProvider';
import type { SizeContextState } from '../context/SizeProvider';

/**
 * Wrapping div that take the shape of its parent.
 *
 * @ignore - do not document.
 */
export const ResizableContainerRoot = styled('div', {
  name: 'MuiResponsiveChart',
  slot: 'Container',
})<{ ownerState: Partial<Pick<SizeContextState, 'width' | 'height'>> }>(({ ownerState }) => ({
  width: ownerState.width ?? '100%',
  height: ownerState.height ?? '100%',
  display: 'flex',
  position: 'relative',
  flexGrow: 1,
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  '&>svg': {
    width: '100%',
    height: '100%',
  },
}));

/**
 * Wrapping div that take the shape of its parent.
 *
 * @ignore - do not document.
 */
export function ResizableContainer(props: { children: React.ReactNode }) {
  const { inHeight, inWidth, hasIntrinsicSize, containerRef } = useSize();

  return (
    <ResizableContainerRoot
      {...props}
      ownerState={{ width: inWidth, height: inHeight }}
      ref={containerRef}
    >
      {hasIntrinsicSize && props.children}
    </ResizableContainerRoot>
  );
}
