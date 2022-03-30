import * as React from 'react';
import { gridColumnDefinitionsSelector } from '../../hooks/features/columns/gridColumnsSelector';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { gridPreferencePanelStateSelector } from '../../hooks/features/preferencesPanel/gridPreferencePanelSelector';
import { GridPreferencePanelsValue } from '../../hooks/features/preferencesPanel/gridPreferencePanelsValue';
import { useGridInternalApiContext } from '../../hooks/utils/useGridInternalApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export const GridPreferencesPanel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function GridPreferencesPanel(props, ref) {
  const apiRef = useGridInternalApiContext();
  const columns = useGridSelector(apiRef, gridColumnDefinitionsSelector);
  const rootProps = useGridRootProps();
  const preferencePanelState = useGridSelector(apiRef, gridPreferencePanelStateSelector);

  const panelContent = apiRef.current.applyPipeProcessors(
    'preferencePanel',
    null,
    preferencePanelState.openedPanelValue ?? GridPreferencePanelsValue.filters,
  );

  return (
    <rootProps.components.Panel
      ref={ref}
      as={rootProps.components.BasePopper}
      open={columns.length > 0 && preferencePanelState.open}
      {...rootProps.componentsProps?.panel}
      {...props}
      {...rootProps.componentsProps?.basePopper}
    >
      {panelContent}
    </rootProps.components.Panel>
  );
});
