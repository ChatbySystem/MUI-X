import * as React from 'react';
import { XGrid, GridOverlay, useGridApiRef } from '@material-ui/x-grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import { useDemoData } from '@material-ui/x-grid-data-generator';
import '../style/grid-stories.css';
import { action } from '@storybook/addon-actions';

function CustomLoadingOverlay() {
  return (
    <GridOverlay>
      <div style={{ position: 'absolute', top: 0, width: '100%' }}>
        <LinearProgress />
      </div>
    </GridOverlay>
  );
}

export default {
  title: 'X-Grid Tests/Rendering',
  component: XGrid,
  parameters: {
    options: { selectedPanel: 'storybook/storysource/panel' },
    docs: {
      page: null,
    },
  },
};
export const RenderInputInCell = () => {
  const handleInputKeyDown = (event) => action('InputChange')(event.target.value);

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      renderCell: (params) => (
        <input type="text" placeholder={params.value} onKeyDown={handleInputKeyDown} />
      ),
    },
  ];

  const rows = [
    {
      id: 1,
      name: 'John',
    },
  ];

  return (
    <div className="grid-container">
      <XGrid rows={rows} columns={columns} />
    </div>
  );
};
export const InfiniteLoading = () => {
  const apiRef = useGridApiRef();
  const [size, setSize] = React.useState(50);
  const { loading, data, setRowLength, loadNewData } = useDemoData({
    dataSet: 'Commodity',
    rowLength: size,
    maxColumns: 20,
  });

  const handleOnScrollBottom = () => {
    const newRowLength = size + 20;
    setSize(newRowLength);
    setRowLength(newRowLength);
    loadNewData();
  };

  return (
    <div className="grid-container">
      <XGrid
        {...data}
        apiRef={apiRef}
        loading={loading}
        onScrollBottom={handleOnScrollBottom}
        components={{
          LoadingOverlay: CustomLoadingOverlay,
        }}
      />
    </div>
  );
};
