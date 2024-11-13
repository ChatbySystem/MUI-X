import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
  gridEditRowsStateSelector,
  useGridSelector,
  useGridApiContext,
} from '@mui/x-data-grid';
import {
  randomCreatedDate,
  randomTraderName,
  randomId,
  randomArrayItem,
} from '@mui/x-data-grid-generator';

const roles = ['Market', 'Finance', 'Development'];
const randomRole = () => {
  return randomArrayItem(roles);
};

const initialRows = [
  {
    id: randomId(),
    name: randomTraderName(),
    age: 25,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 36,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 19,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 28,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 23,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
];

function EditToolbar(props) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [
      ...oldRows,
      { id, name: '', age: '', role: '', isNew: true },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

function GridActionItem({ mode, rowId, ...props }) {
  const apiRef = useGridApiContext();
  const rowModesModel = useGridSelector(apiRef, gridEditRowsStateSelector);

  const currentMode =
    typeof rowModesModel[rowId] === 'undefined'
      ? GridRowModes.View
      : GridRowModes.Edit;

  if (currentMode !== mode) {
    return null;
  }

  return <GridActionsCellItem {...props} />;
}

export default function FullFeaturedCrudGrid() {
  const [rows, setRows] = React.useState(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState({});

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = React.useCallback(
    (id) => () => {
      setRowModesModel((prevRowModesModel) => ({
        ...prevRowModesModel,
        [id]: { mode: GridRowModes.Edit },
      }));
    },
    [],
  );

  const handleSaveClick = React.useCallback(
    (id) => () => {
      setRowModesModel((prevRowModesModel) => ({
        ...prevRowModesModel,
        [id]: { mode: GridRowModes.View },
      }));
    },
    [],
  );

  const handleDeleteClick = React.useCallback(
    (id) => () => {
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    },
    [],
  );

  const handleCancelClick = React.useCallback(
    (id) => () => {
      setRowModesModel((prevRowModesModel) => {
        return {
          ...prevRowModesModel,
          [id]: { mode: GridRowModes.View, ignoreModifications: true },
        };
      });

      setRows((prevRows) => {
        const editedRow = prevRows.find((row) => row.id === id);
        if (editedRow.isNew) {
          return prevRows.filter((row) => row.id !== id);
        }
        return prevRows;
      });
    },
    [setRowModesModel, setRows],
  );

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === newRow.id ? updatedRow : row)),
    );
    return updatedRow;
  };

  const columns = React.useMemo(
    () => [
      { field: 'name', headerName: 'Name', width: 180, editable: true },
      {
        field: 'age',
        headerName: 'Age',
        type: 'number',
        width: 80,
        align: 'left',
        headerAlign: 'left',
        editable: true,
      },
      {
        field: 'joinDate',
        headerName: 'Join date',
        type: 'date',
        width: 180,
        editable: true,
      },
      {
        field: 'role',
        headerName: 'Department',
        width: 220,
        editable: true,
        type: 'singleSelect',
        valueOptions: ['Market', 'Finance', 'Development'],
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        width: 100,
        cellClassName: 'actions',
        getActions: ({ id }) => {
          return [
            <GridActionItem
              rowId={id}
              mode={GridRowModes.Edit}
              icon={<SaveIcon />}
              label="Save"
              sx={{ color: 'primary.main' }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionItem
              rowId={id}
              mode={GridRowModes.Edit}
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
            <GridActionItem
              rowId={id}
              mode={GridRowModes.View}
              icon={<EditIcon />}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick(id)}
              color="inherit"
            />,
            <GridActionItem
              rowId={id}
              mode={GridRowModes.View}
              icon={<DeleteIcon />}
              label="Delete"
              onClick={handleDeleteClick(id)}
              color="inherit"
            />,
          ];
        },
      },
    ],
    [handleCancelClick, handleDeleteClick, handleEditClick, handleSaveClick],
  );

  return (
    <Box
      sx={{
        height: 500,
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={setRowModesModel}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
      />
    </Box>
  );
}
