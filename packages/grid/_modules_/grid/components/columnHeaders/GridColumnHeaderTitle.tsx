import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Tooltip from '@material-ui/core/Tooltip';
import { isOverflown } from '../../utils/domUtils';
import { gridClasses } from '../../gridClasses';

const ColumnHeaderInnerTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function ColumnHeaderInnerTitle(props, ref) {
  const { className, ...other } = props;

  return <div ref={ref} className={clsx(gridClasses.columnHeaderTitle, className)} {...other} />;
});

export interface GridColumnHeaderTitleProps {
  label: string;
  columnWidth: number;
  description?: string;
}

// No React.memo here as if we display the sort icon, we need to recalculate the isOver
function GridColumnHeaderTitle(props: GridColumnHeaderTitleProps) {
  const { label, description, columnWidth } = props;
  const titleRef = React.useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = React.useState('');

  React.useEffect(() => {
    if (!description && titleRef && titleRef.current) {
      const isOver = isOverflown(titleRef.current);
      if (isOver) {
        setTooltip(label);
      } else {
        setTooltip('');
      }
    }
  }, [titleRef, columnWidth, description, label]);

  return (
    <Tooltip title={description || tooltip}>
      <ColumnHeaderInnerTitle ref={titleRef}>{label}</ColumnHeaderInnerTitle>
    </Tooltip>
  );
}

GridColumnHeaderTitle.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  columnWidth: PropTypes.number.isRequired,
  description: PropTypes.string,
  label: PropTypes.string.isRequired,
} as any;

export { GridColumnHeaderTitle };
