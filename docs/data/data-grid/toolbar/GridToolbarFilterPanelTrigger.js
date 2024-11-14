import * as React from 'react';
import {
  DataGrid,
  gridPreferencePanelStateSelector,
  GridPreferencePanelsValue,
  GridToolbarV8 as GridToolbar,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import FilterListIcon from '@mui/icons-material/FilterList';
import useId from '@mui/utils/useId';

function FilterPanelTrigger({ buttonRef }) {
  const buttonId = useId();
  const panelId = useId();
  const apiRef = useGridApiContext();
  const { open, openedPanelValue } = useGridSelector(
    apiRef,
    gridPreferencePanelStateSelector,
  );
  const isOpen = open && openedPanelValue === GridPreferencePanelsValue.filters;

  const toggleFilterPanel = () => {
    if (isOpen) {
      apiRef.current.hidePreferences();
    } else {
      apiRef.current.showPreferences(
        GridPreferencePanelsValue.filters,
        panelId,
        buttonId,
      );
    }
  };

  return (
    <GridToolbar.Button
      ref={buttonRef}
      id={buttonId}
      aria-haspopup="true"
      aria-expanded={isOpen ? 'true' : undefined}
      aria-controls={isOpen ? panelId : undefined}
      onClick={toggleFilterPanel}
    >
      <FilterListIcon fontSize="small" />
      Filters
    </GridToolbar.Button>
  );
}

function Toolbar({ filterButtonRef, ...other }) {
  return (
    <GridToolbar.Root {...other}>
      <FilterPanelTrigger buttonRef={filterButtonRef} />
    </GridToolbar.Root>
  );
}

export default function GridToolbarFilterPanelTrigger() {
  const [filterButtonEl, setFilterButtonEl] = React.useState(null);

  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        slots={{ toolbar: Toolbar }}
        slotProps={{
          panel: { anchorEl: filterButtonEl },
          toolbar: {
            filterButtonRef: setFilterButtonEl,
          },
        }}
      />
    </div>
  );
}
