import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

import Typography from '@mui/material/Typography';

const MUI_X_PRODUCTS = [
  {
    id: 'grid',
    label: 'Data Grid',
    children: [
      { id: 'grid-community', label: '@mui/x-data-grid' },
      { id: 'grid-pro', label: '@mui/x-data-grid-pro' },
      { id: 'grid-premium', label: '@mui/x-data-grid-premium' },
    ],
  },
  {
    id: 'pickers',
    label: 'Date and Time Pickers',
    children: [
      { id: 'pickers-community', label: '@mui/x-date-pickers' },
      { id: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
    ],
  },
  {
    id: 'charts',
    label: 'Charts',
    children: [{ id: 'charts-community', label: '@mui/x-charts' }],
  },
  {
    id: 'tree-view',
    label: 'Tree View',
    children: [{ id: 'tree-view-community', label: '@mui/x-tree-view' }],
  },
];

export default function TrackNodeSelectionToggle() {
  const [lastSelectedNode, setLastSelectedNode] = React.useState(null);

  const handleNodeSelectionToggle = (event, nodeId, isSelected) => {
    if (isSelected) {
      setLastSelectedNode(nodeId);
    }
  };

  return (
    <Stack spacing={2}>
      <Typography>
        {lastSelectedNode == null
          ? 'No node selection recorded'
          : `Last selected node: ${lastSelectedNode}`}
      </Typography>
      <Box sx={{ minHeight: 200, minWidth: 250, flexGrow: 1 }}>
        <RichTreeView
          items={MUI_X_PRODUCTS}
          onNodeSelectionToggle={handleNodeSelectionToggle}
        />
      </Box>
    </Stack>
  );
}
