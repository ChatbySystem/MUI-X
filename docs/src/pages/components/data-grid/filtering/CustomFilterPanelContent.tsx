import * as React from 'react';
import { DataGridPro, GridLinkOperator, GridToolbar } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

const initialState = {
  filter: {
    filterModel: {
      items: [
        {
          id: 1,
          columnField: 'name',
          operatorValue: 'contains',
          value: 'D',
        },
        {
          id: 2,
          columnField: 'name',
          operatorValue: 'contains',
          value: 'D',
        },
        {
          id: 3,
          columnField: 'rating',
          operatorValue: '>',
          value: '0',
        },
      ],
    },
  },
};

export default function CustomFilterPanelContent() {
  const { data } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        components={{
          Toolbar: GridToolbar,
          // Use custom FilterPanel only for deep modification
          // FilterPanel: MyCustomFilterPanel,
        }}
        componentsProps={{
          filterPanel: {
            // Force to use "And" operator
            linkOperators: [GridLinkOperator.And],
            // Display columns by ascending alphabetical order
            columnsSort: 'asc',
            filterFormProps: {
              // Customize inputs by passing props
              columnInputProps: {
                variant: 'outlined',
                size: 'small',
                sx: { justifyContent: 'flex-end' },
              },
              operatorInputProps: {
                variant: 'outlined',
                size: 'small',
                sx: { justifyContent: 'flex-end' },
              },
              valueInputProps: {
                required: true,
              },
            },
            sx: {
              // Customize inputs using css selectors
              '& .MuiDataGrid-filterForm': { p: 2 },
              '& .MuiDataGrid-filterForm:nth-child(even)': {
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark' ? '#444' : '#f5f5f5',
              },
              '& .MuiDataGrid-filterFormDeleteIcon': { order: 1 },
              '& .MuiDataGrid-filterFormLinkOperatorInput': { mr: 2 },
              '& .MuiDataGrid-filterFormColumnInput': { mr: 2, width: 200 },
              '& .MuiDataGrid-filterFormOperatorInput': { mr: 2 },
              '& .MuiDataGrid-filterFormValueInput': { width: 300 },
            },
          },
        }}
        initialState={initialState}
      />
    </div>
  );
}
