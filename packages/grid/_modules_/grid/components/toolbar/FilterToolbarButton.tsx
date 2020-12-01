import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import * as React from 'react';
import { columnLookupSelector } from '../../hooks/features/columns/columnsSelector';
import { GridState } from '../../hooks/features/core/gridState';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import {
  activeFilterItemsSelector,
  filterItemsCounterSelector,
} from '../../hooks/features/filter/filterSelector';
import { PreferencePanelsValue } from '../../hooks/features/preferencesPanel/preferencesPanelValue';
import { useIcons } from '../../hooks/utils/useIcons';
import { optionsSelector } from '../../hooks/utils/useOptionsProp';
import { ApiContext } from '../api-context';

export const FilterToolbarButton: React.FC<{}> = () => {
  const apiRef = React.useContext(ApiContext);
  const options = useGridSelector(apiRef, optionsSelector);
  const counter = useGridSelector(apiRef, filterItemsCounterSelector);
  const activeFilters = useGridSelector(apiRef, activeFilterItemsSelector);
  const lookup = useGridSelector(apiRef, columnLookupSelector);
  const tooltipContentNode = React.useMemo(() => {
    if (counter === 0) {
      return 'Show Filters';
    }
    return (
      <div>
        {counter} active filter(s)
        <ul>
          {activeFilters.map((item) => ({
            ...(lookup[item.columnField!] && (
              <li key={item.id}>
                {lookup[item.columnField!].headerName || item.columnField} {item.operatorValue}{' '}
                {item.value}
              </li>
            )),
          }))}
        </ul>
      </div>
    );
  }, [counter, activeFilters, lookup]);

  const icons = useIcons();
  const filterIconElement = React.createElement(icons.ColumnFiltering!, {});
  const toggleFilter = React.useCallback(() => {
    const {open, openedPanelValue} = apiRef?.current.getState<GridState>().preferencePanel!;
    if(open && openedPanelValue ===  PreferencePanelsValue.filters) {
      apiRef!.current.hideFilterPanel();
    } else {
      apiRef!.current.showFilterPanel();
    }
  }, [apiRef]);

  if (options.disableColumnFilter) {
    return null;
  }

  return (
    <Tooltip title={tooltipContentNode} enterDelay={1000}>
      <Button
        onClick={toggleFilter}
        color="primary"
        aria-label="Show Filters"
        startIcon={
          <Badge badgeContent={counter} color="primary">
            {filterIconElement}
          </Badge>
        }
      >
        Filters
      </Button>
    </Tooltip>
  );
};
