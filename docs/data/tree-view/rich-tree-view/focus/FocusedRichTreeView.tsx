import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';

const MUI_X_PRODUCTS: TreeViewBaseItem[] = [
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

export default function FocusedRichTreeView() {
  const [focusedNode, setFocusedNode] = React.useState<string | null>('charts');

  const handleExpandedNodesChange = (
    event: React.SyntheticEvent,
    nodeId: string | null,
  ) => {
    setFocusedNode(nodeId);
  };

  const handleButtonClick = () => {
    setFocusedNode(() => {
      if (focusedNode === 'charts') {
        return 'grid-pro';
      }
      return 'charts';
    });
  };

  return (
    <Box sx={{ flexGrow: 1, maxWidth: 400 }}>
      <Box sx={{ mb: 1 }}>
        <Button onClick={handleButtonClick}>
          {focusedNode === 'charts' ? 'Focus grid pro' : 'Focus charts'}
        </Button>
      </Box>
      <Box sx={{ height: 264, flexGrow: 1 }}>
        <RichTreeView
          items={MUI_X_PRODUCTS}
          focusedNode={focusedNode}
          onFocusedNodeChange={handleExpandedNodesChange}
          defaultExpandedNodes={['grid', 'charts']}
        />
      </Box>
    </Box>
  );
}
