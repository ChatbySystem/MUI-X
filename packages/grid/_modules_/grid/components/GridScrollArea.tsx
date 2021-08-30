import * as React from 'react';
import { GridEvents } from '../constants/eventsConstants';
import { useGridApiEventHandler } from '../hooks/root/useGridApiEventHandler';
import { GridScrollParams } from '../models/params/gridScrollParams';
import { useGridApiContext } from '../hooks/root/useGridApiContext';
import { getDataGridUtilityClass } from '../gridClasses';
import { composeClasses } from '../utils/material-ui-utils';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { GridOptions } from '../models/gridOptions';

const CLIFF = 1;
const SLOP = 1.5;

interface ScrollAreaProps {
  scrollDirection: 'left' | 'right';
}

type OwnerState = ScrollAreaProps & {
  classes?: GridOptions['classes'];
};

const useUtilityClasses = (ownerState: OwnerState) => {
  const { scrollDirection, classes } = ownerState;

  const slots = {
    root: ['scrollArea', `scrollArea__${scrollDirection}`],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

export const GridScrollArea = React.memo(function GridScrollArea(props: ScrollAreaProps) {
  const { scrollDirection } = props;
  const rootRef = React.useRef<HTMLDivElement>(null);
  const apiRef = useGridApiContext();
  const timeout = React.useRef<any>();
  const [dragging, setDragging] = React.useState<boolean>(false);
  const scrollPosition = React.useRef<GridScrollParams>({
    left: 0,
    top: 0,
  });
  const rootProps = useGridRootProps();
  const ownerState = { ...props, classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

  const handleScrolling = React.useCallback((newScrollPosition) => {
    scrollPosition.current = newScrollPosition;
  }, []);

  const handleDragOver = React.useCallback(
    (event) => {
      let offset: number;

      if (scrollDirection === 'left') {
        offset = event.clientX - rootRef.current!.getBoundingClientRect().right;
      } else if (scrollDirection === 'right') {
        offset = Math.max(1, event.clientX - rootRef.current!.getBoundingClientRect().left);
      } else {
        throw new Error('wrong dir');
      }

      offset = (offset - CLIFF) * SLOP + CLIFF;

      clearTimeout(timeout.current);
      // Avoid freeze and inertia.
      timeout.current = setTimeout(() => {
        apiRef.current.scroll({
          left: scrollPosition.current.left + offset,
          top: scrollPosition.current.top,
        });
      });
    },
    [scrollDirection, apiRef],
  );

  React.useEffect(() => {
    return () => {
      clearTimeout(timeout.current);
    };
  }, []);

  const toggleDragging = React.useCallback(() => {
    setDragging((prevdragging) => !prevdragging);
  }, []);

  useGridApiEventHandler(apiRef, GridEvents.rowsScroll, handleScrolling);
  useGridApiEventHandler(apiRef, GridEvents.columnHeaderDragStart, toggleDragging);
  useGridApiEventHandler(apiRef, GridEvents.columnHeaderDragEnd, toggleDragging);

  return dragging ? (
    <div ref={rootRef} className={classes.root} onDragOver={handleDragOver} />
  ) : null;
});
