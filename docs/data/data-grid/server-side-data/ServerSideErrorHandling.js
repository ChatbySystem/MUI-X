import * as React from 'react';
import { DataGridPro, useGridApiRef, GridToolbar } from '@mui/x-data-grid-pro';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { alpha, styled, darken, lighten } from '@mui/material/styles';
import { useDemoDataSource } from '@mui/x-data-grid-generator';

const pageSizeOptions = [5, 10, 50];
const serverOptions = { useCursorPagination: false };

function getBorderColor(theme) {
  if (theme.palette.mode === 'light') {
    return lighten(alpha(theme.palette.divider, 1), 0.88);
  }
  return darken(alpha(theme.palette.divider, 1), 0.68);
}

const StyledDiv = styled('div')(({ theme: t }) => ({
  position: 'absolute',
  zIndex: 10,
  fontSize: '0.875em',
  top: 0,
  height: '100%',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '4px',
  border: `1px solid ${getBorderColor(t)}`,
  backgroundColor: t.palette.background.default,
}));

function ErrorOverlay({ error }) {
  if (!error) {
    return null;
  }
  return <StyledDiv>{error}</StyledDiv>;
}

export default function ServerSideErrorHandling() {
  const apiRef = useGridApiRef();
  const [error, setError] = React.useState();
  const [shouldRequestsFail, setShouldRequestsFail] = React.useState(false);

  const { getRows, ...props } = useDemoDataSource(
    {},
    serverOptions,
    shouldRequestsFail,
  );

  const dataSource = React.useMemo(() => {
    return {
      getRows,
    };
  }, [getRows]);

  const initialState = React.useMemo(
    () => ({
      ...props.initialState,
      pagination: {
        paginationModel: {
          pageSize: 5,
        },
        rowCount: 0,
      },
    }),
    [props.initialState],
  );

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          onClick={() => {
            setError('');
            apiRef.current.fetchTopLevelRows();
          }}
        >
          Refetch rows
        </Button>
        <FormControlLabel
          control={
            <Checkbox
              checked={shouldRequestsFail}
              onChange={(e) => setShouldRequestsFail(e.target.checked)}
            />
          }
          label="Make the requests fail"
        />
      </div>
      <div style={{ height: 400, position: 'relative' }}>
        <DataGridPro
          {...props}
          unstable_dataSource={dataSource}
          unstable_onServerSideError={(e) => setError(e.message)}
          disableServerSideCache
          apiRef={apiRef}
          pagination
          pageSizeOptions={pageSizeOptions}
          initialState={initialState}
          slots={{ toolbar: GridToolbar }}
        />
        {error && <ErrorOverlay error={error} />}
      </div>
    </div>
  );
}
