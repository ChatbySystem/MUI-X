import * as React from 'react';
import {
  DataGridPro,
  gridColumnLookupSelector,
  gridFilterActiveItemsSelector,
  GridFilterItem,
  GridFilterModel,
  GridToolbarV8 as GridToolbar,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid-pro';
import Chip from '@mui/material/Chip';
import { unstable_capitalize as capitalize } from '@mui/utils';
import { useDemoData } from '@mui/x-data-grid-generator';
import {
  GridFilterListIcon,
  GridFilterPanelTrigger,
  GridSlots,
} from '@mui/x-data-grid';

type ToolbarProps = GridSlots['toolbar'] & {
  onRemoveFilter: (filterId: GridFilterItem['id']) => void;
};

function Toolbar({ onRemoveFilter, ...other }: ToolbarProps) {
  const apiRef = useGridApiContext();
  const activeFilters = useGridSelector(apiRef, gridFilterActiveItemsSelector);
  const columns = useGridSelector(apiRef, gridColumnLookupSelector);

  return (
    <GridToolbar.Root {...other}>
      <GridFilterPanelTrigger render={<GridToolbar.Button />}>
        <GridFilterListIcon fontSize="small" />
      </GridFilterPanelTrigger>

      {activeFilters.map((filter) => {
        const column = columns[filter.field];
        const field = column?.headerName ?? filter.field;
        const operator = apiRef.current.getLocaleText(
          `filterOperator${capitalize(filter.operator)}` as 'filterOperatorContains',
        );
        const isDate = column?.type === 'date';
        const value = isDate
          ? new Date(filter.value).toLocaleDateString()
          : (filter.value ?? '');

        return (
          <Chip
            key={filter.id}
            label={`${field} ${operator} ${value}`}
            onDelete={() => onRemoveFilter(filter.id)}
            sx={{ mx: 0.25 }}
          />
        );
      })}
    </GridToolbar.Root>
  );
}

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'position'];

export default function GridToolbarFilterBar() {
  const { data } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  const [filterModel, setFilterModel] = React.useState<GridFilterModel>({
    items: [
      {
        id: 'rating',
        field: 'rating',
        operator: '>',
        value: '2.5',
      },
      {
        id: 'dateCreated',
        field: 'dateCreated',
        operator: 'before',
        value: '2024-01-01',
      },
    ],
  });

  const onRemoveFilter = (filterId: GridFilterItem['id']) => {
    setFilterModel({
      items: filterModel.items.filter((item) => item.id !== filterId),
    });
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        filterModel={filterModel}
        onFilterModelChange={(newFilterModel) => setFilterModel(newFilterModel)}
        slots={{ toolbar: Toolbar as GridSlots['toolbar'] }}
        slotProps={{ toolbar: { onRemoveFilter } }}
      />
    </div>
  );
}