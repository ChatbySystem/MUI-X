import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
  DataGridPro,
  GridColDef,
  GridColumnGroupHeaderParams,
  GridColumnGroupingModel,
} from '@mui/x-data-grid-pro';

import BuildIcon from '@mui/icons-material/Build';
import PersonIcon from '@mui/icons-material/Person';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 150 },
  {
    field: 'firstName',
    headerName: 'First name',
    width: 150,
    editable: true,
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    width: 150,
    editable: true,
  },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 110,
    editable: true,
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

interface HeaderWithIconProps extends GridColumnGroupHeaderParams {
  icon: React.ReactNode;
}

const HeaderWithIconRoot = styled('div')(({ theme }) => ({
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  '& span': {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginRight: theme.spacing(0.5),
  },
}));

const HeaderWithIcon = (props: HeaderWithIconProps) => {
  const { icon, ...params } = props;

  return (
    <HeaderWithIconRoot>
      <span>{params.headerName ?? params.groupId}</span> {icon}
    </HeaderWithIconRoot>
  );
};

const columnGroupingModel: GridColumnGroupingModel = [
  {
    groupId: 'internal_data',
    headerName: 'Internal',
    description: '',
    renderHeaderGroup: (params) => (
      <HeaderWithIcon {...params} icon={<BuildIcon fontSize="small" />} />
    ),
    children: [{ field: 'id' }],
  },
  {
    groupId: 'character',
    description: 'Information about the character',
    headerName: 'Character',
    renderHeaderGroup: (params) => (
      <HeaderWithIcon {...params} icon={<PersonIcon fontSize="small" />} />
    ),
    children: [
      {
        groupId: 'naming',
        headerName: 'Names',
        children: [{ field: 'lastName' }, { field: 'firstName' }],
      },
      { field: 'age' },
    ],
  },
];
export default function CustomizationDemo() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        rows={rows}
        columns={columns}
        experimentalFeatures={{ columnGrouping: true }}
        checkboxSelection
        disableSelectionOnClick
        columnGroupingModel={columnGroupingModel}
      />
    </div>
  );
}
