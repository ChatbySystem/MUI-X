import * as React from 'react';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const UserType = {
  Admin: 0,
  Regular: 1,
};

export default function ColumnSelectorDisabledGrid() {
  const [userType, setUserType] = React.useState(UserType.Admin);
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 7,
  });

  const columnVisibilityModel = React.useMemo(() => {
    if (userType === UserType.Admin) {
      return {
        quantity: true,
        filledQuantity: true,
        id: true,
      };
    }
    return {
      quantity: false,
      filledQuantity: false,
      id: false,
    };
  }, [userType]);

  return (
    <Stack height="450px" width="100%">
      <FormControl sx={{ width: '200px', pb: 1 }}>
        <InputLabel id="demo-simple-select-label">User Type</InputLabel>
        <Select
          labelId="demo-user-type-label"
          id="demo-user-type"
          value={userType}
          label="User Type"
          onChange={(event: SelectChangeEvent<number>) => {
            setUserType(event.target.value as number);
          }}
        >
          <MenuItem value={UserType.Admin}>Admin</MenuItem>
          <MenuItem value={UserType.Regular}>Regular User</MenuItem>
        </Select>
      </FormControl>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          {...data}
          disableColumnSelector
          columnVisibilityModel={columnVisibilityModel}
          slots={{
            toolbar: GridToolbar,
          }}
        />
      </div>
    </Stack>
  );
}
