import * as React from 'react';
import PropTypes from 'prop-types';
import { ToggleButtonProps } from '@mui/material/ToggleButton';
import { TooltipProps } from '@mui/material/Tooltip';
import { unstable_useId as useId } from '@mui/material/utils';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { gridPreferencePanelStateSelector } from '../../hooks/features/preferencesPanel/gridPreferencePanelSelector';
import { GridPreferencePanelsValue } from '../../hooks/features/preferencesPanel/gridPreferencePanelsValue';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

interface GridToolbarColumnsToggleButtonProps {
  /**
   * The props used for each slot inside.
   * @default {}
   */
  slotProps?: { toggleButton?: Partial<ToggleButtonProps>; tooltip?: Partial<TooltipProps> };
}

const GridToolbarColumnsToggleButton = React.forwardRef<
  HTMLButtonElement,
  GridToolbarColumnsToggleButtonProps
>(function GridToolbarColumnsToggleButton(props, ref) {
  const { slotProps = {} } = props;
  const toggleButtonProps = slotProps.toggleButton || {};
  const tooltipProps = slotProps.tooltip || {};
  const columnButtonId = useId();
  const columnPanelId = useId();

  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const preferencePanel = useGridSelector(apiRef, gridPreferencePanelStateSelector);

  const showColumns = () => {
    if (
      preferencePanel.open &&
      preferencePanel.openedPanelValue === GridPreferencePanelsValue.columns
    ) {
      apiRef.current.hidePreferences();
    } else {
      apiRef.current.showPreferences(
        GridPreferencePanelsValue.columns,
        columnPanelId,
        columnButtonId,
      );
    }
  };

  // Disable the button if the corresponding is disabled
  if (rootProps.disableColumnSelector) {
    return null;
  }

  const isOpen = preferencePanel.open && preferencePanel.panelId === columnPanelId;

  return (
    <rootProps.slots.baseTooltip
      title={apiRef.current.getLocaleText('toolbarColumnsLabel')}
      enterDelay={1000}
      slotProps={{
        popper: {
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, -10],
              },
            },
          ],
        },
      }}
      {...tooltipProps}
      {...rootProps.slotProps?.baseTooltip}
    >
      <rootProps.slots.baseToggleButton
        ref={ref}
        id={columnButtonId}
        size="small"
        sx={{
          border: 0,
        }}
        aria-label={apiRef.current.getLocaleText('toolbarColumnsLabel')}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? columnPanelId : undefined}
        value="columns"
        selected={isOpen}
        {...toggleButtonProps}
        onChange={showColumns}
        {...rootProps.slotProps?.baseToggleButton}
      >
        <rootProps.slots.columnSelectorIcon fontSize="small" />
      </rootProps.slots.baseToggleButton>
    </rootProps.slots.baseTooltip>
  );
});

GridToolbarColumnsToggleButton.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The props used for each slot inside.
   * @default {}
   */
  slotProps: PropTypes.object,
} as any;

export { GridToolbarColumnsToggleButton };
